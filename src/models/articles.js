import query from "./dbConnector";

exports.findOneArticle = (value) => {
  const queryText = "SELECT * FROM articles WHERE id=$1";
  const row = query(queryText, value)
    .then((res) => res.rows[0])
    .catch((err) => err);
  return row;
};

exports.findAllArticles = () => {
  const queryText = "SELECT * FROM articles";
  const rows = query(queryText, [])
    .then((res) => res.rows)
    .catch((err) => err);
  return rows;
};

exports.saveArticle = (values) => {
  const queryText = `INSERT INTO
      articles (id, title, article, createdOn, authorId)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const row = query(queryText, values)
    .then((res) => res.rows[0])
    .catch((error) => error);
  return row;
};

exports.editArticle = (values) => {
  const queryText = "UPDATE articles SET title = $1, article = $2 WHERE id = $3 RETURNING *";
  const rows = query(queryText, values)
    .then((res) => res.rows[0])
    .catch((err) => err);
  return rows;
};


exports.deleteArticle = (value) => {
  const queryText = "DELETE FROM articles WHERE ID=$1 RETURNING *";
  const row = query(queryText, value)
    .then((res) => res.rows[0])
    .catch((err) => {
      throw err;
    });
  return row;
};
