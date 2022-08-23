const db = require("../db/connection.js");
const format = require("pg-format");

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

    return updatedObj[0];
  }
};

exports.fetchArticles = async (query) => {
  const queryValues = [];
  const acceptableQueries = ["sort_by", "topic", "order"];
  const queryKeys = Object.keys(query);

  if (
    !acceptableQueries.includes(queryKeys[0]) &&
    Object.entries(query).length !== 0
  ) {
    return Promise.reject({ status: 400, msg: "Invalid query key!" });
  }

  let queryStr = format(
    "SELECT articles.author,articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, CAST(COUNT(comment_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id"
  );

  if (Object.entries(query).length === 0) {
    queryStr += " GROUP BY articles.article_id ORDER BY created_at DESC;";
    const { rows: articles } = await db.query(`${queryStr}`);

    return articles;
  }

  // if (query.topic !== undefined) {
  //   if (!["mitch"].includes(query.topic)) {
  //     return Promise.reject({ status: 400, msg: "Invalid topic query!" });
  //   }
  // }

  if (query.sort_by !== undefined) {
    if (
      ![
        "author",
        "title",
        "article_id",
        "topic",
        "created_at",
        "votes",
        "comment_count",
      ].includes(query.sort_by)
    ) {
      return Promise.reject({ status: 400, msg: "Invalid sort_by query!" });
    }
  }

  if (query.order !== undefined) {
    if (!["asc", "desc"].includes(query.order)) {
      return Promise.reject({ status: 400, msg: "Invalid order query!" });
    }
  }

  if ("topic" in query) {
    queryValues.push(query.topic);
    queryStr += ` WHERE topic = $1`;
  }

  queryStr += " GROUP BY articles.article_id";

  if ("sort_by" in query) {
    queryStr += " ORDER BY";

    queryStr += ` ${query.sort_by}`;
  } else {
    queryStr += " ORDER BY created_at";
  }

  if ("order" in query) {
    queryStr += ` ${query.order}`;
  } else {
    queryStr += " DESC";
  }

  const { rows: articles } = await db.query(`${queryStr};`, queryValues);

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

exports.uploadArticle = async (objBody) => {
  const { author, title, body, topic } = objBody;
  const testDataArr = [author, title, body, topic];

  for (let i = 0; i < testDataArr.length; i++) {
    if (typeof testDataArr[i] !== "string") {
      return Promise.reject({
        status: 400,
        msg: "Invalid data being posted!",
      });
    }
  }

  const { rows: topics } = await db.query("SELECT slug FROM topics;");
  const topicsArr = topics.map((topic) => {
    return topic.slug;
  });

  if (!topicsArr.includes(topic)) {
    return Promise.reject({ status: 404, msg: "This topic does not exist!" });
  }

  const { rows: authors } = await db.query("SELECT username FROM users;");
  const authorsArr = authors.map((author) => {
    return author.username;
  });

  if (!authorsArr.includes(author)) {
    return Promise.reject({ status: 404, msg: "This author does not exist!" });
  }

  if (!topicsArr.includes(topic)) {
    return Promise.reject({ status: 404, msg: "This topic does not exist!" });
  }

  const { rows: article } = await db.query(
    "INSERT INTO articles (title, topic, author ,body) VALUES ($1, $2, $3, $4) RETURNING *;",
    [title, topic, author, body]
  );

  const article_id = article[0].article_id;

  const { rows: comments } = await db.query(
    "SELECT * FROM articles INNER JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1;",
    [article_id]
  );
  article[0].comment_count = comments.length;

  return article[0];
};
