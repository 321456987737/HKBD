import clientPromise from "@/lib/dbConnect";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("your_db_name");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json({ message: "Sign in successful", token }, { status: 200 });
  } catch (err) {
    console.error("Sign in error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}