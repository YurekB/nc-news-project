const cors = require("cors");

const express = require("express");

const apiRouter = require("./routers/api-routers");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

module.exports = app;
