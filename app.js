const express = require("express");
const { getTopics } = require("./controllers/get.controllers");

const app = express();


app.get("/api/topics", getTopics);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "No such endpoint!" });
});

module.exports = app;
