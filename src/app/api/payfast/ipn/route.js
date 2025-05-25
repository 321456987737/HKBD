import clientPromise from "@/lib/dbConnect";
import { NextResponse } from "next/server";
export async function POST(req) {
  const bodyText = await req.text();
  const rawData = Object.fromEntries(new URLSearchParams(bodyText));
  // const signature = rawData.signature;
  // const passphrase = process.env.PAYFAST_PASSPHRASE || "";

  // Skip signature validation for now
  console.log(rawData)
  console.log(bodyText)
  if (rawData.payment_status === "COMPLETE") {
    try {
      const client = await clientPromise;
      const db = client.db("OrderDB");
      const orders = db.collection("orders");
 
      const existing = await orders.findOne({ payfast_payment_id: rawData.pf_payment_id });
      if (existing) {
        console.log("⚠️ Duplicate payment detected:", rawData.pf_payment_id);
        return NextResponse.json({ success: true, message: "Duplicate payment" });
      }

      await orders.insertOne({
        ...rawData,
        payfast_payment_id: rawData.pf_payment_id,
        createdAt: new Date(),
      });

      console.log("✅ Payment complete and order saved for:", rawData.item_name);
    } catch (err) {
      console.error("❌ DB error:", err);
      return NextResponse.json({ success: false, message: "DB error" }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
