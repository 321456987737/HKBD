import clientPromise from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
   try{
      const client = await clientPromise;
      const db = client.db("your_db_name"); // replace with your DB
      const collection = db.collection("users");
      console.log("1")
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get("id");
      console.log(userId)
      console.log("11")
   
      if (!userId) {
         return NextResponse.json(
         { error: "User ID is required" },
         { status: 400 }
         );
      }
         console.log("111")

      const user = await collection.findOne({ _id: new ObjectId(userId) });
   
      if (!user) {
         return NextResponse.json(
         { error: "User not found" },
         { status: 404 }
         );
      }
   
      return NextResponse.json({ user });
   } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 500 });
   }
}