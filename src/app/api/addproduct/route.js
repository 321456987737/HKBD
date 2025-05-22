import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import clientPromise from "@/lib/dbConnect";

export async function POST(req) {
  try {
    const formData = await req.formData();

    // Get product fields
    const name = formData.get("name");
    const description = formData.get("description");
    const originalprice = formData.get("price");
    const totaldiscount = formData.get("discount");
    const discountedPrice = parseFloat(formData.get("discountedPrice")) || 0; // Ensure discounted price is a number
    const category = formData.get("category");
    const subcategory = formData.get("subcategory");
    const color = formData.get("color");
    const stock = parseInt(formData.get("stock"), 10);
    const sizes = JSON.parse(formData.get("size") || "[]"); // Parse sizes safely
    // Parse sizes safely

    // Calculate discounted price

    // Setup upload directory based on category/subcategory
    const uploadsDir = path.join(process.cwd(), "public/uploads", category, subcategory);
    await fs.mkdir(uploadsDir, { recursive: true });

    // Primary Image
    const primaryImage = formData.get("primaryImage");
    const primaryImageName = `${uuidv4()}-${primaryImage}`;
    const primaryImagePath = path.join(uploadsDir, primaryImageName);

    await fs.writeFile(primaryImagePath, Buffer.from(await primaryImage.arrayBuffer()));

    // Secondary Images
    const secondaryImages = formData.getAll("secondaryImages");
    const secondaryImagePaths = [];

    for (const image of secondaryImages) {
      const imageName = `${uuidv4()}-${image.name}`;
      const imagePath = path.join(uploadsDir, imageName);

      await fs.writeFile(imagePath, Buffer.from(await image.arrayBuffer()));
      secondaryImagePaths.push(`/uploads/${category}/${subcategory}/${imageName}`);
    }

    // Prepare product object
    const newProduct = {
      name,
      description,
      originalprice,
      totaldiscount,
      discountedPrice,
      stock,
      sizes,
      category,
      color,
      subcategory,
      primaryimage: `/uploads/${category}/${subcategory}/${primaryImageName}`,
      secondaryimage: secondaryImagePaths,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into MongoDB
    const client = await clientPromise;
    const db = client.db("products"); // replace with your actual DB name
    const productsCollection = db.collection(category);

    await productsCollection.insertOne(newProduct);

    return NextResponse.json({ message: "Product added successfully" }, { status: 201 });

  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}
