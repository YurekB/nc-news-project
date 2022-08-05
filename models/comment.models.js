const db = require("../db/connection.js");

exports.fetchCommentById = async (id) => {
  const { rows: comment } = await db.query(
    "SELECT * FROM comments WHERE comments.comment_id = $1;",
    [id]
  );

  if (comment.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "No comment found with that id!",
    });
  }

  return comment[0];
};

exports.delComment = async (id) => {
  const { rows: deletedCom } = await db.query(
    "DELETE FROM comments WHERE comment_id = $1",
    [id]
  );
  return deletedCom;
};
