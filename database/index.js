const { Client } = require('pg');
const path = require('path');
const fs = require('fs');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client
  .connect()
  .then()
  .catch(e => console.error('error connecting to postgres db, ', e.stack));

const initializeMessages = () =>
  new Promise((resolve, reject) => {
    fs.readFile(
      path.join(__dirname, '/schema/messages.sql'),
      'utf8',
      (err, data) => (err ? reject(err) : resolve(data)),
    );
  }).then(data => client.query(data));

const initializeUsers = () =>
  new Promise((resolve, reject) => {
    fs.readFile(
      path.join(__dirname, '/schema/users.sql'),
      'utf8',
      (err, data) => (err ? reject(err) : resolve(data)),
    );
  }).then(data => client.query(data));

const postMessage = (message, username) =>
  client.query('INSERT INTO messages (text, username) VALUES ($1, $2) RETURNING *', [
    message,
    username,
  ]);

const getMessages = () => client.query('SELECT * FROM messages').then(data => data.rows);

// TODO storing username and password as basic text. Change this later to more secure version.
const createUser = params =>
  new Promise((resolve, reject) =>
    client.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      params,
      (err, data) => {
        if (err) {
          if (err.code === '23505') {
            resolve(data, '23505');
          }
          reject(err);
        }
        resolve(data);
      },
    ));

const login = params =>
  client.query('SELECT * FROM users WHERE username = ($1) AND password = ($2)', params);

if (process.env.INITIALIZEDB) {
  initializeMessages()
    .then()
    .catch(console.log);

  initializeUsers()
    .then()
    .catch(console.log);
}

module.exports = {
  client,
  initializeMessages,
  postMessage,
  getMessages,
  login,
  createUser,
  initializeUsers,
};
