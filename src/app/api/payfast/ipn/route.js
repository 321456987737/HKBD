import clientPromise from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import crypto from "crypto";

export async function POST(req) {
  try {
    const bodyText = await req.text();
    const rawData = Object.fromEntries(new URLSearchParams(bodyText));
    
    console.log("📩 IPN received:", rawData);

    // Verify signature (important for security)
    const signature = rawData.signature;
    delete rawData.signature;
    
    const parameterString = Object.keys(rawData)
      .filter(key => rawData[key] !== "")
      .map(key => `${key}=${encodeURIComponent(rawData[key].trim())}`)
      .join("&");
    
    const calculatedSignature = crypto
      .createHash("md5")
      .update(parameterString + "&passphrase=" + encodeURIComponent(process.env.PAYFAST_PASSPHRASE))
      .digest("hex");
    
    if (calculatedSignature !== signature) {
      console.error("❌ Invalid signature:", { received: signature, calculated: calculatedSignature });
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 403 }
      );
    }

    // Only process COMPLETE payments
    if (rawData.payment_status !== "COMPLETE") {
      console.log("ℹ️ Payment not complete, status:", rawData.payment_status);
      return NextResponse.json({ success: true });
    }

    const client = await clientPromise;
    const db = client.db("OrderDB");
    const orders = db.collection("orders");

    const orderId = rawData.custom_str1 || rawData.m_payment_id;

    // Check for duplicate payment
    const existingOrder = await orders.findOne({
      "payment.payfast_payment_id": rawData.pf_payment_id,
    });

    if (existingOrder) {
      console.warn("⚠️ Duplicate payment detected:", rawData.pf_payment_id);
      return NextResponse.json({ success: true, message: "Duplicate payment" });
    }

    // Find and update the order
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
          "status": "COMPLETED",
          "updatedAt": new Date(),
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      console.error("❌ No pending order found for ID:", orderId);
      return NextResponse.json(
        { success: false, message: "Order not found or already processed" },
        { status: 404 }
      );
    }

    console.log("✅ Payment completed for order:", orderId);

    // Optional: Send confirmation email or update other systems here

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("❌ Error processing IPN:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}