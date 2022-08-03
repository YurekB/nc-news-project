const db = require("../db/connection.js");

exports.fetchArticleById = async (id) => {
  const { rows: article } = await db.query(
    "SELECT * FROM articles WHERE articles.article_id = $1;",
    [id]
  );
  if (article.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "No article found with that id!",
    });
  }
  const { rows: comments } = await db.query(
    "SELECT * FROM articles INNER JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1;",
    [id]
  );
  article[0].comment_count = comments.length;
  return article[0];
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

exports.fetchArticles = async () => {
  const { rows: articles } = await db.query("SELECT * FROM articles;");

  if (articles.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "No article found with that id!",
    });
  }
  const { rows: comments } = await db.query(
    "SELECT * FROM articles INNER JOIN comments ON articles.article_id = comments.article_id"
  );

  const updatedArt = articles.map((article) => {
    const commArr = comments.filter((comment) => {
      if (comment.article_id === article.article_id) {
        return comment;
      }
    });

    article.comment_count = commArr.length;
    return article;
  });
  return updatedArt;
};
