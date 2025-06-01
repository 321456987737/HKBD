import clientPromise from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import crypto from "crypto";

export async function POST(req) {
  try {
    // 1. Parse the raw body text
    const bodyText = await req.text();
    console.log("🔸 Raw IPN text received:", bodyText);

    const rawData = Object.fromEntries(new URLSearchParams(bodyText));
    console.log("🔹 Parsed IPN data:", rawData);

    // 2. Signature verification
    const signature = rawData.signature;
    delete rawData.signature;

    const parameterString = Object.keys(rawData)
      .filter((key) => rawData[key] !== "")
      .sort() // ✅ Must sort keys alphabetically
      .map((key) => `${key}=${encodeURIComponent(rawData[key].trim())}`)
      .join("&");

    const calculatedSignature = crypto
      .createHash("md5")
      .update(parameterString + "&passphrase=" + process.env.PAYFAST_PASSPHRASE)
      .digest("hex");

    if (calculatedSignature !== signature) {
      console.error("❌ Invalid signature detected");
      console.error("Calculated:", calculatedSignature);
      console.error("Received:", signature);
      console.error("String used:", parameterString + "&passphrase=" + process.env.PAYFAST_PASSPHRASE);
      return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 403 });
    }

    // 3. Skip if payment is not complete
    if (rawData.payment_status !== "COMPLETE") {
      console.log("ℹ️ Payment not complete. Ignoring.");
      return NextResponse.json({ success: true });
    }

    const client = await clientPromise;
    const db = client.db("OrderDB");
    const orders = db.collection("orders");
    const sales = db.collection("sales");

    const orderId = rawData.custom_str1;

    // 4. Check for duplicate payment
    const existingSale = await sales.findOne({
      paymentId: rawData.pf_payment_id,
    });
    if (existingSale) {
      console.warn("⚠️ Duplicate sale detected");
      return NextResponse.json({ success: true });
    }

    // 5. Update order
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
      console.error("❌ No pending order found for ID:", orderId);
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    // 6. Fetch updated order
    const completedOrder = await orders.findOne({ _id: new ObjectId(orderId) });
    if (!completedOrder) {
      console.error("❌ Completed order fetch failed");
      return NextResponse.json({ success: false, message: "Order fetch error" }, { status: 500 });
    }

    // 7. Insert into sales
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

    const saleInsert = await sales.insertOne(saleData);
    console.log("✅ Sale recorded with ID:", saleInsert.insertedId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ IPN error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
