const express = require("express");

const apiRouter = require("./routers/api-routers");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

module.exports = app;
