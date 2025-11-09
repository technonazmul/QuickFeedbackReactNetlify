import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://technonazmul:K2SGsegubXQkoPBF@cluster0.9opgunk.mongodb.net/smart-tasks?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);

    if (!data.name || !data.message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Name and message are required." }),
      };
    }

    await client.connect();
    const db = client.db("feedbackDB");
    await db.collection("feedback").insertOne(data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Feedback saved!" }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  } finally {
    await client.close();
  }
}
