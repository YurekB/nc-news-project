const { fetchUsers, fetchByUsername } = require("../models/user.models");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((response) => {
      res.status(200).send({ users: response });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getByUsername = (req, res, next) => {
  fetchByUsername(req.params.username)
    .then((response) => {
      res.status(200).send({ user: response });
    })
    .catch((err) => {
      next(err);
    });
};
