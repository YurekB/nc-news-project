const express = require("express");
const { getTopics, getArticleById } = require("./controllers/get.controllers");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "No such endpoint!" });
});

app.use((err, req, res, next) => {
  res.status(404).send({ msg: err.msg });
});

module.exports = app;
