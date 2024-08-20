const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const mongoURI = process.env.MONGODB_URI;

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.listen(PORT, (error) => {
  if (!error) {
    console.log(`Server is running on port ${PORT}`);
  } else {
    console.log("Problem starting server. Message:", error);
  }
});
// Path: /
app.get("/", (req, res) => {
  res.send("Hello World");
});

// fake comments
const comments = [
  {
    cmntId: 123,
    cmntTxt: "this show rulz",
    timeCommented: Math.floor(new Date().getTime() / 1000) - 13,
    streamId: 1,
    username: "user1",
    signedIn: false,
  },
  {
    cmntId: 124,
    cmntTxt: "this show sucks",
    timeCommented: Math.floor(new Date().getTime() / 1000) - 65,
    streamId: 1,
    username: "user2",
    signedIn: false,
  },
  {
    cmntId: 125,
    cmntTxt: "this show is ok",
    timeCommented: Math.floor(new Date().getTime() / 1000),
    streamId: 1,
    username: "user3",
    signedIn: false,
  },
];

// this actually needs to be a db model with with streaming capabilities sending chunks of comments
// Path /comments Method: GET
app.get("/comments", async (req, res) => {
  console.log("fetching comments");
  //   use db model to fetch comments
  let commentsList = await getComments();
  console.log("commentsList: ", commentsList);
  // testing with mock local data
  // const commentsList = [];
  // for (let i = 0; i < comments.length; i++) {
  //   commentsList.push(comments[i], comments[i], comments[i]);
  // }
  // console.log("commentsList: ", commentsList);
  res.send(commentsList);
  res.end();
});

//  fake user
let user = [3, 125];
//Path /comments Method: POST
app.post("/comments", async (req, res) => {
  console.log("comment received: ", req.body);
  let newComment = req.body.comment;
  // newComment.cmntId = user[1] + 1;
  // user[0]++;
  // user[1] = newComment.cmntId;
  newComment.streamId = 1;

  const result = await sendComment(newComment);
  // comments.push(result);
  // console.log("comments: ", comments);
  res.send(result);
  res.end();
});

const getComments = async () => {
  await client.connect();
  const dbName = process.env.MONGODB_COMMENTS_DB;
  const collectionName = process.env.MONGODB_COMMENTS_COLLECTION;
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  try {
    const result = await collection.find({ streamId: 1 }).toArray();
    console.log("comments fetched: ", result);
    return result;
  } catch (err) {
    console.error("error fetching comments: ", err);
  }
};

const sendComment = async (cmntObj) => {
  await client.connect();
  const dbName = process.env.MONGODB_COMMENTS_DB;
  const collectionName = process.env.MONGODB_COMMENTS_COLLECTION;
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  try {
    const result = await collection.insertOne(cmntObj);
    console.log("comment inserted: ", result);
    const comntId = result.insertedId;
    const comment = await collection.findOne({ _id: comntId });
    const commentsList = await collection.find({ streamId: 1 }).toArray();
    console.log("comment: ", comment, "commentsList: ", commentsList);
    return [comment, commentsList];
  } catch (err) {
    console.error("error inserting comment: ", err);
  }
};

// app.get("/users/:userId", (req, res) => {});

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(mongoURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
