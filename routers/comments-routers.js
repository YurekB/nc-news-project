const {
  deleteComment,
  getCommentById,
  patchCommentById,
} = require("../controllers/comment.controllers");

const commentsRouter = require("express").Router();

commentsRouter
  .route("/:comment_id")
  .get(getCommentById)
  .delete(deleteComment)
  .patch(patchCommentById);

module.exports = commentsRouter;
