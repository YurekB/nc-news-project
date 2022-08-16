const { getUsers, getByUsername } = require("../controllers/user.controllers");

const usersRouter = require("express").Router();

usersRouter.get("/", getUsers);

usersRouter.get("/:username", getByUsername);

module.exports = usersRouter;
