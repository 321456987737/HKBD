import clientPromise from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("your_db_name");
    const collection = db.collection("users");

    // Find all admin users (super-admin, moderator, editor)
    const admins = await collection.find({
      role: { $in: ["super-admin", "moderator", "editor"] }
    }).toArray();

    return NextResponse.json({ admins });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch admins" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const { email, role } = await req.json();

  if (!email || !role) {
    return NextResponse.json(
      { error: "Email and role are required" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("your_db_name");
    const collection = db.collection("users");

    // Check if user already exists
    const existingUser = await collection.findOne({ email });
    
    if (existingUser) {
      // Update existing user's role if different
      if (existingUser.role !== role) {
        const result = await collection.updateOne(
          { email },
          { $set: { role } }
        );
        
        if (result.modifiedCount === 0) {
          return NextResponse.json(
            { error: "Failed to update user role" },
            { status: 400 }
          );
        }

        const updatedUser = await collection.findOne({ email });
        return NextResponse.json({
          message: "User role updated successfully",
          admin: updatedUser,
        });
      }
      
      return NextResponse.json(
        { error: "User already has this role" },
        { status: 400 }
      );
    }

    // Create new admin user if doesn't exist
    const newAdmin = {
      email,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newAdmin);
    newAdmin._id = result.insertedId;

    return NextResponse.json({
      message: "Admin created successfully",
      admin: newAdmin,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  const { id, role } = await req.json();

  if (!id || !role) {
    return NextResponse.json(
      { error: "ID and role are required" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("your_db_name");
    const collection = db.collection("users");

    // Always try ObjectId first
    let query;
    let objectId;
    if (/^[a-f\d]{24}$/i.test(id)) {
      try {
        objectId = new ObjectId(id);
        query = { _id: objectId };
      } catch {
        query = { _id: id };
      }
    } else {
      query = { _id: id };
    }

    const updatedUser = await collection.findOneAndUpdate(
      query,
      { $set: { role } },
      { returnDocument: "after" }
    );

    if (!updatedUser || !updatedUser.value) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Admin updated successfully",
      admin: updatedUser.value,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update admin" },
      { status: 500 }
    );
  }
}
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Admin ID is required" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("your_db_name");
    const collection = db.collection("users");

    const user = await collection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role === "super-admin") {
      return NextResponse.json(
        { error: "Cannot remove role from super-admin" },
        { status: 400 }
      );
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $unset: { role: "" } } // ❗ This removes the "role" field
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to remove role" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Role removed successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to remove role" },
      { status: 500 }
    );
  }
}

