import { NextResponse } from "next/server";
import clientPromise from "@/lib/dbConnect";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory"); // ✅ new line

    if (!category) {
      return NextResponse.json(
        { error: "Category parameter is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("products");
    const productsCollection = db.collection(category);

    // ✅ Add filtering conditionally
    const filter = {};
    if (subcategory) {
      filter.subcategory = subcategory;
    }

    const products = await productsCollection.find(filter).toArray();

    return NextResponse.json({
      success: true,
      products,
      message: "Products fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
