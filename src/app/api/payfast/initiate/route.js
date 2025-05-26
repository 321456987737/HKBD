import clientPromise from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import crypto from "crypto";

export async function POST(req) {
  try {
    const body = await req.json();
    const { formData, cartItems, total } = body;

    // Validate input data
    if (!formData || !cartItems || !total) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("OrderDB");
    const orders = db.collection("orders");

    // Create order document
    const orderDoc = {
      customer: {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        city: formData.city,
        postalCode: formData.postalCode,
        phone: formData.phone,
        address: formData.address,
      },
      cartItems,
      total,
      payment: {
        method: "PayFast",
        status: "PENDING",
      },
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await orders.insertOne(orderDoc);
    const orderId = result.insertedId;

    // Prepare PayFast parameters
    const payfastParams = {
      merchant_id: 10039135,
      merchant_key: "o9aid5znsobbg",
      return_url: `${"https://hkbd.vercel.app"}/payment-success?orderId=${orderId}`,
      cancel_url: `${"https://hkbd.vercel.app"}/payment-cancel?orderId=${orderId}`, 
      notify_url: `${"https://hkbd.vercel.app"}/api/payfast/ipn`,
      amount: total.toFixed(2),
      item_name: `Order #${orderId.toString()}`,
      item_description: cartItems.map((item) => item.name).join(", "),
      name_first: formData.firstName.substring(0, 100),
      name_last: formData.lastName.substring(0, 100),
      email_address: formData.email.substring(0, 255),
      phone_number: formData.phone.replace(/[^0-9]/g, "").substring(0, 20),
      custom_str1: orderId.toString(),
      m_payment_id: orderId.toString(),
    };

    // Remove empty parameters
    Object.keys(payfastParams).forEach(
      (key) => payfastParams[key] == null && delete payfastParams[key]
    );

    // Generate parameter string
    const parameterString = new URLSearchParams(payfastParams).toString();
    const payfastUrl = `https://sandbox.payfast.co.za/eng/process?${parameterString}`;
    return NextResponse.json({
      success: true,
      url: payfastUrl,
      orderId: orderId.toString(),
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
