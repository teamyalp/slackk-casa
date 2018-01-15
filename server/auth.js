const bcrypt = require('bcrypt');
const db = require('../database');

const addUser = async (username, password, email, passwordHint) =>
  db.createUser(username, await bcrypt.hash(password, 1), email, passwordHint);

const checkUser = async (username, password) =>
  bcrypt.compare(password, (await db.getUser(username)).password);

module.exports = {
  addUser,
  checkUser,
};
