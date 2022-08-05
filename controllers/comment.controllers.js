const { delComment, fetchCommentById } = require("../models/comment.models");

exports.getCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  fetchCommentById(comment_id)
    .then((response) => {
      res.status(200).send({ comment: response });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  Promise.all([fetchCommentById(comment_id), delComment(comment_id)])
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
