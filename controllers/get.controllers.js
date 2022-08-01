const { fetchTopics } = require("../models/get.controllers");

exports.getTopics = (req, res, next) => {
  fetchTopics().then((response) => {
    res.status(200).send(response);
  });
};
