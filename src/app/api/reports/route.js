import { NextResponse } from "next/server";
import clientPromise from "@/lib/dbConnect";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("ReportsDB");
    const collection = db.collection("reports");

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "newest";
    const skip = (page - 1) * limit;

    // Build query for search
    const query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { report: { $regex: search, $options: "i" } }
      ];
    }

    // Determine sort order
    const sortOrder = sort === "oldest" ? 1 : -1;

    // Fetch reports with pagination, search, and sorting
    const reports = await collection
      .find(query)
      .sort({ date: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count (with search filter if applicable)
    const total = await collection.countDocuments(query);

    return NextResponse.json({ reports, total });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

export async function POST(req) {  // Changed from PATCH to POST
  try {
    const client = await clientPromise;
    const db = client.db("ReportsDB");
    const reportsCollection = db.collection("reports");
    
    const body = await req.json();
    const { report, username, email } = body;
      console.log(email, username, report);
    if (!report || !username || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const newReport = {
      report,
      username,
      email,
      date: new Date(),  // Use server date instead of client-provided date
      status: "unresolved",  // Add default status
      createdAt: new Date(),
    };
    const result = await reportsCollection.insertOne(newReport);

    return NextResponse.json({
      message: "Report created successfully",
      id: result.insertedId,
    });
  } catch (error) {
    console.error("Failed to create report:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}