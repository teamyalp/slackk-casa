const bcrypt = require('bcrypt');
const db = require('../database');

const addUser = (username, password) =>
  bcrypt.hash(password, 1).then(hash => db.createUser(username, hash));

const checkUser = (username, password) =>
  db.getUser(username).then(data => bcrypt.compare(password, data.password));

module.exports = {
  addUser,
  checkUser,
};
