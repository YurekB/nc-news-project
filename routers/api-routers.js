const { getApi } = require("../controllers/api.controllers");
const topicsRouter = require("./topics-routers");
const articlesRouter = require("./articles-routers");
const usersRouter = require("./users-routers");
const commentsRouter = require("./comments-routers");

const apiRouter = require("express").Router();

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/users", usersRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/", getApi);

apiRouter.use("/*", (req, res) => {
  res.status(404).send({ msg: "No such endpoint!" });
});

module.exports = apiRouter;
