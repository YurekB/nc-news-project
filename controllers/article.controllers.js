const { ident } = require("pg-format");
const {
  fetchArticleById,
  updateArticleById,
  fetchArticles,
  fetchArticleCommentsById,
} = require("../models/article.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((response) => {
      res.status(200).send({ article: response });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const body = req.body;
  updateArticleById(article_id, body)
    .then((response) => {
      res.status(200).send({ article: response });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((response) => {
      res.status(200).send({ articles: response });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([
    fetchArticleById(article_id),
    fetchArticleCommentsById(article_id),
  ])
    .then((response) => {
      res.status(200).send({ comments: response[1] });
    })
    .catch((err) => {
      next(err);
    });
};
