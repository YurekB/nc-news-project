const { fetchTopics } = require("../models/topic.models");

exports.getTopics = (req, res, next) => {
  fetchTopics().then(({ rows: response }) => {
    res.status(200).send({ topics: response });
  });
};
