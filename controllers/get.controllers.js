const { fetchTopics, fetchArticleById } = require("../models/get.controllers");

exports.getTopics = (req, res, next) => {
  fetchTopics().then(({ rows: response }) => {
    res.status(200).send({ topics: response });
  });
};

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
