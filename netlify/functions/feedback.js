import { MongoClient } from "mongodb";

// 1. Get your secret connection string from environment variables
const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://technonazmul:K2SGsegubXQkoPBF@cluster0.9opgunk.mongodb.net/smart-tasks?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

export async function handler(event) {
  // 2. Only allow POST requests
  if (event.httpMethod !== "POST") {
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
    // 3. Parse the data from the 'body', not query parameters
    const { name, message } = JSON.parse(event.body);

    if (!name || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Name and message are required." }),
      };
    }

    await client.connect();
    const db = client.db("feedbackDB");
    await db.collection("feedback").insertOne({ name, message });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Feedback saved!" }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Internal Server Error" }),
    };
  } finally {
    // Ensure the client closes even if an error occurs
    await client.close();
  }
}
