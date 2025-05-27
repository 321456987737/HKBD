import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/dbConnect";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("OrderDB");

    const { searchParams } = new URL(req.url);
    const skip = parseInt(searchParams.get("skip") || "0");
    const limit = parseInt(searchParams.get("limit") || "5");
    const lastId = searchParams.get("lastId");

    let query = {};

    // For pagination after the first page
    if (lastId) {
      query = {
        _id: { $lt: new ObjectId(lastId) },
      };
    }

    const orders = await db
      .collection("orders")
      .aggregate([
        { $match: query },
        { $sort: { createdAt: -1, _id: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "products",
            localField: "cartItems.productId",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $addFields: {
            cartItems: {
              $map: {
                input: "$cartItems",
                as: "item",
                in: {
                  $mergeObjects: [
                    "$$item",
                    {
                      $arrayElemAt: [
                        "$productDetails",
                        {
                          $indexOfArray: [
                            "$productDetails._id",
                            "$$item.productId",
                          ],
                        },
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $project: {
            productDetails: 0,
          },
        },
      ])
      .toArray();

    return NextResponse.json({
      orders,
      hasMore: orders.length === limit,
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const client = await clientPromise;
    const db = client.db("OrderDB");
    const collection = db.collection("orders");

    const body = await req.json();
    const { orderId, updates } = body;

    if (!orderId || !updates || typeof updates !== "object") {
      return NextResponse.json(
        { error: "Invalid request: missing or invalid data" },
        { status: 400 }
      );
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Order updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Error updating order:", err);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
