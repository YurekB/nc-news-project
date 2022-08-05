const data = require("../endpoints.json");

exports.getApi = (req, res, next) => {
  res
    .status(200)
    .send({ json: data })
    .catch((err) => {
      next(err);
    });
};
