import { MongoClient, ServerApiVersion } from "mongodb";

const mongoURI = process.env.MONGODB_URI;

exports.handler = async (event, context) => {
  const method = event.httpMethod;

  // Connect to MongoDB
  const client = await connectToDb();

  try {
    if (method === "GET") {
      const comments = await getComments(client);
      return {
        statusCode: 200,
        body: JSON.stringify(comments),
      };
    } else if (method === "POST") {
      const newComment = JSON.parse(event.body);
      const result = await sendComment(client, newComment);
      return {
        statusCode: 201,
        body: JSON.stringify(result),
      };
    } else {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: "Method not allowed" }),
      };
    }
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  } finally {
    await client.close();
  }
};

async function connectToDb() {
  const client = new MongoClient(mongoURI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  await client.connect();
  return client;
}

const getComments = async (client) => {
  const dbName = process.env.MONGODB_COMMENTS_DB;
  const collectionName = process.env.MONGODB_COMMENTS_COLLECTION;
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  try {
    const result = await collection.find({ streamId: 1 }).toArray();
    return result;
  } catch (err) {
    console.error("error fetching comments: ", err);
    throw err;
  }
};

const sendComment = async (client, cmntObj) => {
  const dbName = process.env.MONGODB_COMMENTS_DB;
  const collectionName = process.env.MONGODB_COMMENTS_COLLECTION;
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  try {
    const result = await collection.insertOne(cmntObj);
    const comntId = result.insertedId;
    const comment = await collection.findOne({ _id: comntId });
    const commentsList = await collection.find({ streamId: 1 }).toArray();
    return [comment, commentsList];
  } catch (err) {
    console.error("error inserting comment: ", err);
    throw err;
  }
};
