import clientPromise from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import crypto from "crypto";

export async function POST(req) {
  try {
    // 1. Get raw body as text (PayFast sends application/x-www-form-urlencoded)
    const bodyText = await req.text();
    console.log("Raw body text received:", bodyText);

    const rawData = Object.fromEntries(new URLSearchParams(bodyText));
    console.log("Parsed IPN data:", rawData);

    // 2. Extract and verify signature
    const receivedSignature = rawData.signature;
    delete rawData.signature;

    const parameterString = Object.keys(rawData)
      .filter((key) => rawData[key] !== "")
      .sort() // 🔒 Ensure keys are sorted alphabetically
      .map((key) => `${key}=${encodeURIComponent(rawData[key].trim())}`)
      .join("&");

    // ❗ DO NOT ENCODE THE PASSPHRASE
    const signatureString = `${parameterString}&passphrase=${process.env.PAYFAST_PASSPHRASE}`;
    const calculatedSignature = crypto
      .createHash("md5")
      .update(signatureString)
      .digest("hex");

    if (calculatedSignature !== receivedSignature) {
      console.error("❌ Invalid signature detected");
      console.error("Calculated:", calculatedSignature);
      console.error("Received:", receivedSignature);
      console.error("String used:", signatureString);
      return NextResponse.json({ success: false }, { status: 403 });
    }

    // 3. Skip non-COMPLETE payments
    if (rawData.payment_status !== "COMPLETE") {
      console.log("ℹ️ Payment not COMPLETE. Ignoring.");
      return NextResponse.json({ success: true });
    }

    const client = await clientPromise;
    const db = client.db("OrderDB");
    const orders = db.collection("orders");
    const sales = db.collection("sales");

    const orderId = rawData.custom_str1;

    // 4. Prevent duplicate sales
    const existingSale = await sales.findOne({
      paymentId: rawData.pf_payment_id,
    });
    if (existingSale) {
      console.warn("⚠️ Duplicate sale detected");
      return NextResponse.json({ success: true });
    }

    // 5. Update the order as COMPLETED
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
      console.error("❌ No matching PENDING order found");
      return NextResponse.json({ success: false }, { status: 404 });
    }

    const completedOrder = await orders.findOne({ _id: new ObjectId(orderId) });
    if (!completedOrder) {
      console.error("❌ Could not retrieve completed order");
      return NextResponse.json({ success: false }, { status: 500 });
    }

    // 6. Insert new sale
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
    console.log("✅ Sale recorded:", saleInsert.insertedId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ IPN Handler Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
