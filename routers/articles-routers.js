const {
  getArticleById,
  patchArticleById,
  getArticles,
  getArticleCommentsById,
  postCommentByArticleId,
} = require("../controllers/article.controllers");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getArticles);
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);
articlesRouter
  .route("/:article_id/comments")
  .get(getArticleCommentsById)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
