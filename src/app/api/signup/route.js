import clientPromise from "@/lib/dbConnect";
import bcrypt from "bcrypt";
import { uid } from "uid";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();
    console.log(username, email, password);
    if (!username || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const client = await clientPromise;

    const db = client.db("your_db_name");
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      email,
      password: hashedPassword,
      id: uid(25),
      createdAt: new Date(),
    };

    await usersCollection.insertOne(newUser);

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}