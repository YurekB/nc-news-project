const {
  fetchArticleById,
  updateArticleById,
} = require("../models/article.models");

exports.getArticleById = (req, res, next) => {
  const id = Object.values(req.params);
  fetchArticleById(id[0])
    .then((response) => {
      res.status(200).send({ article: response });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const id = Object.values(req.params);
  const body = req.body;
  updateArticleById(id[0], body)
    .then((response) => {
      res.status(200).send({ article: response });
    })
    .catch((err) => {
      next(err);
    });
};
