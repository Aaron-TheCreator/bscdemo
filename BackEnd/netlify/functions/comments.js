const { MongoClient, ServerApiVersion } = require("mongodb");

let HEADERS = {
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "*/*", //optional
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};
// this ID currently needs to be an integer, not yet sure what data type I will use once streamID's
// represent value from LivePeer or other service
const CURRENT_STREAM_ID = parseInt(process.env.CURRENT_STREAM_ID);
console.log(
  "CURRENT_STREAM_ID is valid integer : ",
  Number.isInteger(CURRENT_STREAM_ID)
);

exports.handler = async (event, context) => {
  const mongoURI = process.env.MONGODB_URI;
  const method = event.httpMethod;

  console.log("Received event:", JSON.stringify(event, null, 2));
  // Connect to MongoDB
  const client = await connectToDb(mongoURI);
  // console.log("Connected to MongoDB", client);

  // I think OPTIONS needs to be handled for CORS outside of the below try/catch block
  if (method === "OPTIONS") {
    return {
      statusCode: 200,
      HEADERS,
    };
  }
  try {
    if (method === "GET") {
      console.log("Fetching comments...");
      const comments = await getComments(client);
      return {
        statusCode: 200,
        HEADERS,
        body: JSON.stringify(comments),
      };
    } else if (method === "POST") {
      console.log("Posting comment...", event.body);
      const newComment = JSON.parse(event.body);
      const result = await sendComment(client, newComment);
      return {
        statusCode: 201,
        HEADERS,
        body: JSON.stringify(result),
      };
    } else {
      return {
        statusCode: 405,
        HEADERS,
        body: JSON.stringify({ message: "Method not allowed" }),
      };
    }
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      HEADERS,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  } finally {
    await client.close();
  }
};

async function connectToDb(mongoURI) {
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
  // console.log(".env vars loaded: ", dbName, collectionName);
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  try {
    console.log("hitting mongodb db...");
    const result = await collection
      .find({
        streamId: Number.isInteger(CURRENT_STREAM_ID) ? CURRENT_STREAM_ID : 1,
      })
      .toArray();
    await client.close();
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
  console.log("cmntObj: ", cmntObj);
  cmntObj.comment.streamId = Number.isInteger(CURRENT_STREAM_ID)
    ? CURRENT_STREAM_ID
    : 1;
  try {
    const result = await collection.insertOne(cmntObj.comment);
    const comntId = result.insertedId;
    console.log("comntId is valid: ", comntId != false, comntId);
    const comment = await collection.findOne({ _id: comntId });
    console.log("comment in DB: ", comment);
    const commentsList = await collection.find({ streamId: 1 }).toArray();
    console.log("commentsList from DB: ", commentsList);
    await client.close();
    return [comment, commentsList];
  } catch (err) {
    console.error("error inserting comment: ", err);
    throw err;
  }
};
