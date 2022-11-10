const express = require("express");
const app = express();
const fs = require("fs");
app.use(express.json());
const mongoose = require("mongoose");
const Post = require("./Models/Post");
const port = 3000;

let response = fs.readFileSync("./data.json", "utf-8");
let data = JSON.parse(response);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/data", (req, res) => {
  res.send(data);
});

app.get("/api/data/:age", (req, res) => {
  let member = data.find((e) => e.age === parseInt(req.params.age));
  res.send(member);
});

app.post("/", (req, res) => {
  let post = new Post({
    title: req.body.title,
    desc: req.body.desc,
  });

  if (post) {
    post.save()
    console.log(post);
    res.send(post);
  }
});

app.post("/api/data", (req, res) => {
  let newMember = {};
  newMember.name = req.body.name;
  newMember.age = req.body.age;
  data.push(newMember);
  fs.writeFileSync("./data.json", JSON.stringify(data));
  res.send(newMember);
});

app.put("/api/data/:age", (req, res) => {
  let member = data.find((e) => e.age === parseInt(req.params.age));
  if (!member) res.status(400).send("No User Found...");

  member.name = req.body.name;
  member.age = req.body.age;
  fs.writeFileSync("./data.json", JSON.stringify(data));
  res.send(data);
});

app.delete("/api/data/:age", (req, res) => {
  let newData = data.filter((e) => e.age != parseInt(req.params.age));
  if (newData == data) res.status(400).send("No User Found...");

  fs.writeFileSync("./data.json", JSON.stringify(newData));
  res.send(req.params);
});

mongoose.connect(
  "mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb",
  () => {
    console.log("DB connected");
  }
);

app.listen(port, () => console.log(`app is listening on port ${port}`));
