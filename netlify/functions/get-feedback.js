import { MongoClient } from "mongodb";

// Get your secret connection string from environment variables
const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://technonazmul:K2SGsegubXQkoPBF@cluster0.9opgunk.mongodb.net/smart-tasks?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

export async function handler(event) {
  // Only allow GET
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  // Safety check
  if (!uri) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server configuration error: MONGODB_URI not set.",
      }),
    };
  }

  try {
    await client.connect();
    const db = client.db("feedbackDB");
    const collection = db.collection("feedback");

    // Find all feedback, sort by 'createdAt' in descending order (newest first)
    const feedbacks = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(feedbacks),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Internal Server Error" }),
    };
  } finally {
    await client.close();
  }
}
