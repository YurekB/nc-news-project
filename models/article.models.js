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
  const { rows: articles } = await db.query(
    "SELECT articles.author,articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, CAST(COUNT(comment_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;"
  );

  return articles;
};

exports.fetchArticleCommentsById = async (id) => {
  const { rows: comments } = await db.query(
    "SELECT * FROM comments WHERE article_id = $1",
    [id]
  );
  return comments;
};

exports.postCommByArticleId = async (id, objBody) => {
  const { username, body } = objBody;
  const { rows: comment } = await db.query(
    "INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;",
    [body, username, id]
  );
  return comment[0];
};
