const { fetchUsers } = require("../models/user.models");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((response) => {
      res.status(200).send({ users: response });
    })
    .catch((err) => {
      next(err);
    });
};
