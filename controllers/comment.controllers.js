const { delComment } = require("../models/comment.models");

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  delComment(comment_id)
    .then(() => {
      res.status(204).send({ comment: {} });
    })
    .catch((err) => {
      next(err);
    });
};
