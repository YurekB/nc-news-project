const db = require("../db/connection.js");

exports.fetchArticleById = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then(({ rows: res }) => {
      if (res.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No article found with that id!",
        });
      } else return res[0];
    });
};

exports.updateArticleById = async (id, body) => {
  const updatedNum = body.inc_votes;
  if (typeof updatedNum !== "number") {
    return Promise.reject({ status: 400, msg: "Invalid value being patched!" });
  } else {
    const { rows: updatedObj } = await db.query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [updatedNum, id]
    );
    if (updatedObj.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "No article found with that id!",
      });
    }
    if (updatedObj[0].votes < 0) {
      return Promise.reject({
        status: 400,
        msg: "Cannot have less than 0 votes!",
      });
    }
    return updatedObj[0];
  }
};
