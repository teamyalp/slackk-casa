const bcrypt = require('bcrypt');
const db = require('../database');

// add a user to the database, uses bcrypt to hash password
const addUser = async (username, password, email, passwordHint) =>
  // insert user into users table with hashed password
  db.createUser(username, await bcrypt.hash(password, 1), email, passwordHint);

// checks username and password against entries in the database, uses bcrypt to compare hashes
const checkUser = async (username, password) =>
  // pull hashed password from database, use bcrypt to compare hash with entered password
  bcrypt.compare(password, (await db.getUser(username)).password);

module.exports = {
  addUser,
  checkUser,
};
