const express = require("express");
const { getTopics } = require("./controllers/topic.controllers");
const {
  getArticleById,
  patchArticleById,
  getArticles,
  getArticleCommentsById,
  postCommentByArticleId,
} = require("./controllers/article.controllers");
const { getUsers } = require("./controllers/user.controllers");
const {
  deleteComment,
  getCommentById,
} = require("./controllers/comment.controllers");
const { getApi } = require("./controllers/api.controllers");

const app = express();

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getArticleCommentsById);

app.get("/api/users", getUsers);

app.get("/api/comments/:comment_id", getCommentById);

app.patch("/api/articles/:article_id", patchArticleById);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.delete("/api/comments/:comment_id", deleteComment);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "No such endpoint!" });
});

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

module.exports = app;
