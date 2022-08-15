const data = require("../endpoints.json");

exports.getApi = (req, res, next) => {
  if (req.url.length > 1) {
    next();
  }
  res
    .status(200)
    .send({ json: data })
    .catch((err) => {
      next(err);
    });
};
