const express = require("express");
const cors = require("cors");

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
app.get("/comments", (req, res) => {
  console.log("comments fetched");
  //   use db model to fetch comments
  const commentsList = [];
  for (let i = 0; i < comments.length; i++) {
    commentsList.push(comments[i], comments[i], comments[i]);
  }
  console.log("commentsList: ", commentsList);
  res.send(commentsList);
  res.end();
});

//  fake user
let user = [3, 125];
//Path /comments Method: POST
app.post("/comments", (req, res) => {
  console.log("comment received: ", req.body);
  let newComment = req.body.comment;
  newComment.cmntId = user[1] + 1;
  newComment.username = `${newComment.username}${user[0] + 1}`;
  user[0]++;
  user[1] = newComment.cmntId;
  newComment.streamId = 1;
  newComment.signedIn = false;
  comments.push(newComment);
  console.log("comments: ", comments);
  res.send(comments);
  res.end();
});
