const { getTopics } = require("../controllers/topic.controllers");

const topicsRouter = require("express").Router();

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
