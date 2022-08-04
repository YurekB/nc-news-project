const db = require("../db/connection.js");

exports.delComment = async (id) => {
  const { rows: allComs } = await db.query("SELECT * FROM comments;");

  if (id > allComs.length) {
    return Promise.reject({
      status: 404,
      msg: "No comment found with that id!",
    });
  }

  const { rows: deletedCom } = await db.query(
    "DELETE FROM comments WHERE comment_id = $1",
    [id]
  );
  return deletedCom;
};
