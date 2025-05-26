import clientPromise from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const bodyText = await req.text();
    const rawData = Object.fromEntries(new URLSearchParams(bodyText));

    if (rawData.payment_status === "COMPLETE") {
      const client = await clientPromise;

      const orderDb = client.db("PaymentDBase");
      const orders = orderDb.collection("paymentss");

      const orderId = rawData.custom_str1;

      const existingOrder = await orders.findOne({
        "payment.payfast_payment_id": rawData.pf_payment_id,
      });

      if (existingOrder) {
        console.warn("⚠️ Duplicate payment detected:", rawData.pf_payment_id);
        return NextResponse.json({ success: true, message: "Duplicate payment" });
      }

      const pending = await orders.findOne({
        _id: new ObjectId(orderId),
        status: "PENDING",
      });

      if (!pending) {
        console.error("❌ No pending order found for ID:", orderId);
        return NextResponse.json({ success: false, message: "Order ID not found" }, { status: 404 });
      }

      await orders.updateOne(
        { _id: new ObjectId(orderId) },
        {
          $set: {
            "payment.payfast_payment_id": rawData.pf_payment_id,
            "payment.status": rawData.payment_status,
            "payment.amount_gross": rawData.amount_gross,
            "payment.amount_fee": rawData.amount_fee,
            "payment.amount_net": rawData.amount_net,
            "payment.completedAt": new Date(),
            status: "COMPLETED"
          }
        }
      );

      // Fetch the updated order
      const updatedOrder = await orders.findOne({ _id: new ObjectId(orderId) });

      if (!updatedOrder) {
        console.error("❌ Updated order not found");
        return NextResponse.json({ success: false, message: "Failed to fetch updated order" }, { status: 500 });
      }

      // Insert into dashboard DB
      try {
        const dashboardDb = client.db("DashboardDBase");
        const dashboardOrders = dashboardDb.collection("completed_orders");

        console.log("📦 Inserting updated order into dashboard DB:", updatedOrder);
        await dashboardOrders.insertOne(updatedOrder);
        console.log("✅ Order copied to DashboardDBase successfully");
      } catch (copyError) {
        console.error("❌ Failed to insert into dashboard DB:", copyError);
      }

      console.log("✅ Payment completed and order finalized:", rawData.item_name);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("❌ Error processing IPN:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
