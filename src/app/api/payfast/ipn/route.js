import clientPromise from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const bodyText = await req.text();
    const rawData = Object.fromEntries(new URLSearchParams(bodyText));
    console.log("IPN received:", rawData);

    // Only proceed if payment is marked as COMPLETE
    if (rawData.payment_status === "COMPLETE") {
      const client = await clientPromise;

      // Use the SAME database and collection as in your /initiate route!
      const db = client.db("PaymentDBase"); // Make sure this matches your initiate route
      const orders = db.collection("paymentss"); // Make sure this matches your initiate route

      const orderId = rawData.custom_str1;

      // Prevent duplicate processing
      const existingOrder = await orders.findOne({
        "payment.payfast_payment_id": rawData.pf_payment_id,
      });

      if (existingOrder) {
        console.warn("⚠️ Duplicate payment detected:", rawData.pf_payment_id);
        return NextResponse.json({ success: true, message: "Duplicate payment" });
      }

      // Check for a pending order with the given ID
      const pending = await orders.findOne({
        _id: new ObjectId(orderId),
        status: "PENDING",
      });

      if (!pending) {
        console.error("❌ No pending order found for ID:", orderId);
        return NextResponse.json({ success: false, message: "Order ID not found" }, { status: 404 });
      }

      // Update the original order with payment info
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

      // Optionally, save it to a dashboard collection
      const dashboardDb = client.db("DashboardDBase");
      const dashboardOrders = dashboardDb.collection("completed_orders");
      await dashboardOrders.insertOne(updatedOrder);

      console.log("✅ Payment completed and order finalized:", rawData.item_name);
    }

    // Respond with success even if payment_status was not COMPLETE
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("❌ Error processing IPN:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}