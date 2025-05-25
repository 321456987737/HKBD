// app/api/users/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/dbConnect";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db("your_db_name"); // replace with your DB
    const collection = db.collection("users");

    const { searchParams } = new URL(req.url);
    const skip = parseInt(searchParams.get("skip")) || 0;

    const users = await collection
      .find({})
      .sort({ _id: 1 }) // Sort by _id ascending
      .skip(skip)
      .limit(3)
      .toArray();

    return NextResponse.json({ users });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

