// /app/api/payfast/initiate/route.js

import clientPromise from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { formData, cartItems, total } = body;

    const client = await clientPromise;
    const db = client.db("OrderDB");
    const orders = db.collection("orders");

    const result = await orders.insertOne({
      customer: {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        city: formData.city,
        postalCode: formData.postalCode,
        phone: formData.phone,
        address: formData.adress,
      },
      cartItems,
      total,
      payment: {
        method: formData.paymentMethod,
        status: "PENDING",
      },
      status: "PENDING",
      createdAt: new Date(),
    });

    const orderId = result.insertedId;

    const payfastParams = {
      merchant_id: process.env.PAYFAST_MERCHANT_ID,
      merchant_key: process.env.PAYFAST_MERCHANT_KEY,
      RETURN_URL: "https://hkbd.vercel.app",
      CANCEL_URL: "https://hkbd.vercel.app/payment-cancel",
      NOTIFY_URL: "https://hkbd.vercel.app/api/payfast/ipn",
      merchant_id: process.env.merchant_id,
      merchant_key: process.env.merchant_key,
      amount: total.toFixed(2),
      item_name: cartItems.map((item) => item.name).join(", "),
      custom_str1: orderId.toString(),
    };

    const queryString = new URLSearchParams(payfastParams).toString();

    const payfastUrl = `https://sandbox.payfast.co.za/eng/process?${queryString}&RETURN_URL=${"https://hkbd.vercel.app"}`;

    return NextResponse.json({ success: true, url: payfastUrl });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
