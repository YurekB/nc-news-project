const {
  deleteComment,
  getCommentById,
} = require("../controllers/comment.controllers");

const commentsRouter = require("express").Router();

commentsRouter.route("/:comment_id").get(getCommentById).delete(deleteComment);

module.exports = commentsRouter;
