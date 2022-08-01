const { nextTick } = require("process");
const db = require("../db/connection.js");

exports.fetchTopics = async () => {
  const result = await db.query("SELECT * FROM topics;");

  return result;
};

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
