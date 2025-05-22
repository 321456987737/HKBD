import clientPromise from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const id = searchParams.get("id");

    if (!category || !subcategory || !id) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid id" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("products");
    const collection = db.collection(category);

    // Fetch the main product
    const product = await collection.findOne({ _id: new ObjectId(id) });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Fetch extra products from the same subcategory, excluding the current product
    const extraproduct = await collection
      .find({
        subcategory,
        _id: { $ne: new ObjectId(id) },
      })
      .limit(10) // Limit the number of extra products
      .toArray();

    return NextResponse.json({ product, extraproduct });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}