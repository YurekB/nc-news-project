const {
  getArticleById,
  patchArticleById,
  getArticles,
  getArticleCommentsById,
  postCommentByArticleId,
  postArticle,
} = require("../controllers/article.controllers");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);
articlesRouter
  .route("/:article_id/comments")
  .get(getArticleCommentsById)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
