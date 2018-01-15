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
  .catch(err => console.error('error connecting to postgres db, ', err.stack));

const initializeDB = () => {
  const schemas = ['/schema/users.sql', '/schema/workspaces.sql'];
  return Promise.all(schemas.map(schema =>
    new Promise((resolve, reject) => {
      fs.readFile(
        path.join(__dirname, schema),
        'utf8',
        (err, data) => (err ? reject(err) : resolve(data)),
      );
    }).then(data => client.query(data))));
};

const postMessage = (message, username, workspaceId) =>
  client
    .query('SELECT db_name FROM workspaces WHERE id = $1', [workspaceId])
    .then(data =>
      client.query(
        'INSERT INTO $db_name (text, username) VALUES ($1, $2) RETURNING *'.replace(
          '$db_name',
          data.rows[0].db_name,
        ),
        [message, username],
      ));

const getMessages = workspaceId =>
  client
    .query('SELECT db_name FROM workspaces WHERE id = $1', [workspaceId])
    .then(data => client.query('SELECT * FROM $db_name'.replace('$db_name', data.rows[0].db_name)))
    .then(data => data.rows);

const createUser = (username, passhash, email, passhint) =>
  new Promise((resolve, reject) =>
    client.query(
      'INSERT INTO users (username, password, email, password_hint) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, passhash, email, passhint],
      (err, data) => {
        if (err) {
          if (err.code === '23505') {
            resolve(
              {
                username,
              },
              '23505',
            );
          }
          reject(err);
        }
        resolve(data.rows[0]);
      },
    ));

const getUser = username =>
  client
    .query('SELECT password FROM users WHERE username = ($1)', [username])
    .then(data => data.rows[0]);

const getPasswordHint = username =>
  client
    .query('SELECT password_hint FROM users WHERE username = ($1)', [username])
    .then(data => data.rows[0]);

const createWorkspace = (name, dbName = `ws_${name}${Date.now()}`) =>
  new Promise((resolve, reject) =>
    client.query(
      'INSERT INTO workspaces (name, db_name) VALUES ($1, $2) RETURNING *',
      [name, dbName],
      (err, data) => {
        if (err) {
          if (err.code === '23505') {
            resolve({ name, db_name: dbName }, '23505');
          }
          reject(err);
        }
        resolve(data);
      },
    ))
    .then(() =>
      new Promise((resolve, reject) => {
        fs.readFile(
          path.join(__dirname, '/schema/messages.sql'),
          'utf8',
          (err, data) => (err ? reject(err) : resolve(data)),
        );
      }))
    .then(data => client.query(data.replace('$1', dbName).replace('$1_pk', `${dbName}_pk`)));

const getWorkspaces = () => client.query('SELECT * FROM workspaces').then(data => data.rows);

const getEmails = () => client.query('SELECT email FROM USERS')
  .then(data => data.rows);

if (process.env.INITIALIZEDB) {
  initializeDB()
    .then()
    .catch(err => console.error('error creating database tables, ', err.stack));
}

module.exports = {
  client,
  initializeDB,
  postMessage,
  getMessages,
  createUser,
  getUser,
  createWorkspace,
  getWorkspaces,
  getEmails,
  getPasswordHint,
};
