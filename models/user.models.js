const db = require("../db/connection.js");

exports.fetchUsers = async () => {
  const { rows: users } = await db.query("SELECT * FROM users;");
  return users;
};

exports.fetchByUsername = async (username) => {
  const { rows: user } = await db.query(
    "SELECT * FROM users WHERE username = $1;",
    [username]
  );

  if (user.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "No user found with that username!",
    });
  }

  return user[0];
};
