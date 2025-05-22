// app/api/product/[id]/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const  id = searchParams.get('id');
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("products");
    
    // You might want to get category from query params if needed
    
    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    const collection = db.collection(category);
    const product = await collection.findOne({ _id: new ObjectId(id) });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}