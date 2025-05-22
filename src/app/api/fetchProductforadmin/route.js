import { NextResponse } from "next/server";
import clientPromise from "@/lib/dbConnect"; // Ensure this path matches your project structure
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("products");

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const subcategory = searchParams.get("subcategory") || "";
    const status = searchParams.get("status") || "";

    // Build query filters
    const buildQuery = (baseQuery = {}) => {
      const query = { ...baseQuery };

      // Add search filter if provided
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { sku: { $regex: search, $options: "i" } },
        ];
      }

      // Add subcategory filter if provided
      if (subcategory) {
        query.subcategory = subcategory;
      }

      // Add status filter if provided
      if (status) {
        query.status = status;
      }

      return query;
    };

    // Determine which collections to query based on category
    let collections = [];
    if (!category || category === "All") {
      collections = ["Men", "Women", "Boys", "Girls"];
    } else if (["Men", "Women", "Boys", "Girls"].includes(category)) {
      collections = [category];
    }

    // Count total products matching the criteria
    let totalProducts = 0;
    for (const collection of collections) {
      const query = buildQuery();
      const count = await db.collection(collection).countDocuments(query);
      totalProducts += count;
    }

    // Fetch data from all relevant collections
    let allData = [];
    for (const collection of collections) {
      const query = buildQuery();
      const data = await db.collection(collection).find(query).toArray();

      // Add collection name as category if not already set
      allData = allData.concat(
        data.map((item) => ({
          ...item,
          category: item.category || collection,
        }))
      );
    }

    // Sort data - implement basic in-memory sorting
    if (searchParams.get("sortKey") && searchParams.get("sortDirection")) {
      const sortKey = searchParams.get("sortKey");
      const sortDirection =
        searchParams.get("sortDirection") === "asc" ? 1 : -1;

      allData.sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return -1 * sortDirection;
        if (a[sortKey] > b[sortKey]) return 1 * sortDirection;
        return 0;
      });
    }

    // Apply pagination to the combined dataset
    const paginatedData = allData.slice(skip, skip + limit);

    return NextResponse.json({
      allData: paginatedData,
      totalProducts,
      message: "Data fetching completed successfully",
      success: true,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: error.message,
        message: "Error fetching data",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const client = await clientPromise;
    const db = client.db("products");

    const body = await req.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Invalid or missing 'ids' array" },
        { status: 400 }
      );
    }

    // Define collections to delete from
    const collections = ["Men", "Women", "Boys", "Girls"];

    // Convert all string ids to ObjectId
    const objectIds = ids.map((id) => new ObjectId(id));

    let deletedCount = 0;

    // Try deleting from each collection
    for (const collectionName of collections) {
      const collection = db.collection(collectionName);

      const result = await collection.deleteMany({ _id: { $in: objectIds } });
      deletedCount += result.deletedCount;
    }

    return NextResponse.json({
      message: `${deletedCount} product(s) deleted successfully`,
      success: true,
    });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      {
        error: error.message,
        message: "Error deleting products",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const client = await clientPromise;
    const db = client.db("products");

    const body = await req.json();
    const { updatedData } = body;
    const { _id, category } = updatedData;

    if (!_id || !category) {
      return NextResponse.json({ error: "Product ID and category are required" }, { status: 400 });
    }

    // Validate category
    const validCategories = ["Men", "Women", "Boys", "Girls"];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // Copy updatedData and remove _id (it's immutable in MongoDB)
    const { _id: ignore, ...fieldsToUpdate } = updatedData;

    const result = await db.collection(category).updateOne(
      { _id: new ObjectId(_id) },
      { $set: fieldsToUpdate }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "No changes made or product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Product updated successfully",
      success: true,
      updatedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Update error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
