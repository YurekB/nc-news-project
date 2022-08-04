const express = require("express");
const { getTopics } = require("./controllers/topic.controllers");
const {
  getArticleById,
  patchArticleById,
  getArticles,
} = require("./controllers/article.controllers");
const { getUsers } = require("./controllers/user.controllers");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/users", getUsers);

app.patch("/api/articles/:article_id", patchArticleById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "No such endpoint!" });
});

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

module.exports = app;
