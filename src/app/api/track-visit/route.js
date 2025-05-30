import clientPromise from "@/lib/dbConnect";

export async function POST(req) {
  try {
    const { visitorId, path } = await req.json();

    if (!visitorId) {
      return new Response(
        JSON.stringify({ error: "Missing visitorId" }),
        { status: 400 }
      );
    }

    // Extract visitor IP address
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      req.socket?.remoteAddress ||
      "Unknown";

    const client = await clientPromise;
    const db = client.db("VisitDB");
    const collection = db.collection("visits");

    // Get current date boundaries (start and end of today)
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    // Check if a visit from this IP exists today
    const existingVisit = await collection.findOne({
      ip,
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    });

    if (existingVisit) {
      // Already logged today, skip insert
      return new Response(
        JSON.stringify({ message: "Visit already recorded today" }),
        { status: 200 }
      );
    }

    // Insert new visit record
    await collection.insertOne({
      visitorId,
      path: path || "/",
      createdAt: new Date(),
      ip,
    });

    return new Response(
      JSON.stringify({ message: "Visit recorded" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Failed to log visit:", err);
    return new Response(
      JSON.stringify({ error: "Failed to log visit" }),
      { status: 500 }
    );
  }
}
