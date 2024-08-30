const { MongoClient, ServerApiVersion } = require("mongodb");

let HEADERS = {
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "*/*", //optional
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

exports.handler = async (event, context) => {
  const mongoURI = process.env.MONGODB_URI;
  const method = event.httpMethod;
  const user = event.queryStringParameters;
  console.log("user: ", user);

  // Connect to MongoDB
  const client = await connectToDb(mongoURI);
  let now = new Date();
  console.log(
    `Received event @ ${now.toString()}: `,
    JSON.stringify(event, null, 2)
  );
  try {
    if (method === "OPTIONS") {
      // console.log("client is active : ", client);
      return {
        statusCode: 200,
        HEADERS,
      };
    }
  } catch (err) {
    console.error("Internal server error in OPTIONS block: ", err);
    return {
      statusCode: 500,
      HEADERS,
      body: JSON.stringify({
        message: "Internal server error",
      }),
    };
  }

  try {
    if (method === "GET") {
      console.log(`Fetching comments for user ${user.username}...`);
      const comments = await getComments(client, user.username);
      return {
        statusCode: 200,
        HEADERS,
        body: JSON.stringify(comments),
      };
    }
  } catch (err) {
    console.error("Internal server error ifetching user's comments", err);
    return {
      statusCode: 500,
      HEADERS,
      body: JSON.stringify({
        message: "Internal server error ifetching user's comments",
      }),
    };
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

const getComments = async (client, username) => {
  console.log("fetching user's comments: ", username);
  const dbName = process.env.MONGODB_COMMENTS_DB;
  const collectionName = process.env.MONGODB_COMMENTS_COLLECTION;
  // console.log(".env vars loaded: ", dbName, collectionName);
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  try {
    const result = await collection
      .find({
        username: username,
      })
      .toArray();
    await client.close();
    console.log("comments where username matches: ", username, result);
    return result;
  } catch (err) {
    console.error("error fetching comments: ", err);
    throw err;
  }
};
