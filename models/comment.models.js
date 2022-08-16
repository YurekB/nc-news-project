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

exports.updateCommentById = async (id, body) => {
  const updatedNum = body.inc_votes;
  if (typeof updatedNum !== "number") {
    return Promise.reject({ status: 400, msg: "Invalid value being patched!" });
  } else {
    const { rows: updatedObj } = await db.query(
      "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;",
      [updatedNum, id]
    );

    if (updatedObj.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "No comment found with that id!",
      });
    }
    return updatedObj[0];
  }
};
