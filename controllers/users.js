/* eslint-disable no-console */
/* eslint-disable radix */
import pg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000,
};

const pool = new pg.Pool(config);

exports.token = (request, response) => {
  const userEmail = request.body.email;
  const userPassword = request.body.password;

  // check if user is a registered user
  pool.query("SELECT * FROM users WHERE email = $1", [userEmail], (error, results) => {
    if (error) {
      throw (error);
    }
    const { email, password } = results.rows[0];

    // compared saved hashed password to supplied password
    bcrypt.compare(userPassword, password).then(
      (valid) => {
        if (!valid) {
          response.status(401).send({
            status: "error",
            error: "Incorrect password",
          });
        }
        const token = jwt.sign(
          { userId: email },
          "RANDOM_TOKEN_SECRET",
          { expiresIn: "24h" },
        );

        // respond with jwt token
        response.status(200).send({
          status: "success",
          data: {
            userId: email,
            token,
          },
        });
      },
    ).catch(
      (err) => response.status(500).send({
        status: "error",
        err,
      }),
    );
  });
};

// create user
exports.createUser = (request, response) => {
  const data = {
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    userName: request.body.userName,
    email: request.body.email,
    password: request.body.password,
    isStaff: request.body.isStaff,
  };

  let hashedPassword;

  // hash password before saving
  bcrypt.hash(request.body.password, 10).then(
    (hash) => {
      hashedPassword = hash;
    },

  ).catch(
    (error) => {
      response.status(500).send({
        status: "error",
        error,
      });
    },
  );


  pool.connect((error, client, done) => {
    const query = "INSERT INTO users(first_name, last_name, username, email, password, is_staff) VALUES($1,$2,$3,$4,$5,$6) RETURNING *";
    const values = [
      data.firstName,
      data.lastName,
      data.userName,
      data.email,
      hashedPassword,
      data.isStaff,
    ];
    client.query(query, values, (err, result) => {
      done();
      if (err) {
        response.status(400).send({
          status: "error",
          err: err.stack,
        });
      } else {
        response.status(202).send({
          status: "success",
          data: result.rows[0],

        });
      }
    });
  });
};

exports.viewAllUsers = (request, response) => {
  pool.connect((err, client, done) => {
    const query = "SELECT * FROM users";
    client.query(query, (error, result) => {
      done();
      if (error) {
        response.status(400).send({
          status: "error",
          error,
        });
      } else if (result.rows < "1") {
        response.status(200).send({
          status: "success",
          data: [],
        });
      } else {
        response.status(200).send({
          status: "success",
          data: result.rows,
        });
      }
    });
  });
};

exports.getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      response.status(400).send({
        status: "error",
        error,
      });
    }
    response.status(200).send({
      status: "success",
      data: results.rows,
    });
  });
};

exports.modifyUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { username, email } = request.body;

  pool.query(
    "UPDATE users SET username = $1, email = $2 WHERE id = $3", [username, email, id],
    (error) => {
      if (error) {
        response.status(400).send({
          status: "error",
          error: error.stack,
        });
      }
      response.status(200).send({
        status: "success",
        data: `User modified with ID: ${id}`,
      });
    },
  );
};

exports.deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (error) => {
    if (error) {
      response.status(400).send({
        status: "error",
        error,
      });
    }
    response.status(200).send({
      status: "success",
      data: `User deleted with ID: ${id}`,
    });
  });
};
