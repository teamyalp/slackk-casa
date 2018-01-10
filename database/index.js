const { Client } = require('pg');
const path = require('path');
const fs = require('fs');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client
  .connect()
  .then(() => console.log('connected to postgres db'))
  .catch(e => console.error('error connecting to postgres db, ', e.stack));

const initializeDB = () =>
  new Promise((resolve, reject) => {
    fs.readFile(
      path.join(__dirname, '/schema/messages.sql'),
      'utf8',
      (err, data) => (err ? reject(err) : resolve(data)),
    );
  }).then(data => client.query(data));

const postMessage = message =>
  client.query('INSERT INTO messages (text) VALUES ($1) RETURNING *', [message]);

const getMessages = () => client.query('SELECT * FROM messages').then(data => data.rows);

if (process.env.INITIALIZEDB) {
  initializeDB()
    .then(console.log)
    .catch(console.log);
}

module.exports = {
  initializeDB,
  postMessage,
  getMessages,
};
