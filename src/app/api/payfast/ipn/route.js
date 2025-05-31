import clientPromise from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import crypto from "crypto";

export async function POST(req) {
  try {
    const bodyText = await req.text();
    const rawData = Object.fromEntries(new URLSearchParams(bodyText));
    console.log("IPN received:", rawData);

    // 1. Signature Verification

    const signature = rawData.signature;
    delete rawData.signature;
    const parameterString = Object.keys(rawData)
      .filter((key) => rawData[key] !== "")
      .map((key) => `${key}=${encodeURIComponent(rawData[key].trim())}`)
      .join("&");
    const calculatedSignature = crypto
      .createHash("md5")
      .update(
        parameterString +
          "&passphrase=" +
          encodeURIComponent(process.env.PAYFAST_PASSPHRASE)
      )
      .digest("hex");
    if (calculatedSignature !== signature) {
      console.error("❌ Invalid signature detected");
      return NextResponse.json({ success: false }, { status: 403 });
    }
    if (calculatedSignature !== signature) {
      console.error("❌ Invalid signature detected");
      console.error("Calculated Signature:", calculatedSignature);
      console.error("Received Signature:", signature);
      console.error("Parameter String:", parameterString); // useful
      return NextResponse.json({ success: false }, { status: 403 });
    }

    // 2. Only process COMPLETE payments
    if (rawData.payment_status !== "COMPLETE") {
      console.log("ℹ️ Payment not complete. Skipping.");
      return NextResponse.json({ success: true });
    }

    const client = await clientPromise;
    const db = client.db("OrderDB");
    const orders = db.collection("orders");
    const sales = db.collection("sales");
    const orderId = rawData.custom_str1;

    // 3. Check for duplicate payment
    const existingSale = await sales.findOne({
      paymentId: rawData.pf_payment_id,
    });
    if (existingSale) {
      console.warn("⚠️ Duplicate sale detected");
      return NextResponse.json({ success: true });
    }

    // 4. Update order with payment info
    const updateResult = await orders.updateOne(
      { _id: new ObjectId(orderId), status: "PENDING" },
      {
        $set: {
          "payment.payfast_payment_id": rawData.pf_payment_id,
          "payment.status": rawData.payment_status,
          "payment.amount_gross": parseFloat(rawData.amount_gross),
          "payment.amount_fee": parseFloat(rawData.amount_fee),
          "payment.amount_net": parseFloat(rawData.amount_net),
          "payment.completedAt": new Date(),
          status: "COMPLETED",
          updatedAt: new Date(),
        },
      }
    );
    if (updateResult.matchedCount === 0) {
      console.error("❌ No pending order found");
      return NextResponse.json({ success: false }, { status: 404 });
    }

    // 5. Get the updated order
    const completedOrder = await orders.findOne({
      _id: new ObjectId(orderId),
    });
    if (!completedOrder) {
      console.error("❌ Completed order not found");
      return NextResponse.json({ success: false }, { status: 500 });
    }

    // 6. Prepare sales data
    const saleData = {
      orderId,
      customerId: completedOrder.customer?.email || "unknown",
      amount: {
        gross: parseFloat(rawData.amount_gross),
        fee: parseFloat(rawData.amount_fee),
        net: parseFloat(rawData.amount_net),
      },
      totalSales: parseFloat(rawData.amount_net),
      items: Array.isArray(completedOrder.cartItems)
        ? completedOrder.cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          }))
        : [],
      paymentMethod: "PayFast",
      paymentId: rawData.pf_payment_id,
      saleDate: new Date(),
      status: "completed",
      metadata: {
        pfProcessingId: rawData.pf_payment_id,
        pfStatus: rawData.payment_status,
      },
    };

    // 7. Insert into sales collection
    const saleInsert = await sales.insertOne(saleData);
    console.log("✅ Sale inserted:", saleInsert.insertedId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ IPN processing error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
