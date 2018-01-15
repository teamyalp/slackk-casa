const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const auth = require('./auth');
const db = require('../database');

/*
  Passport configuration setup
*/

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    // uses auth.checkUser function to compare username and password with username and password hash from database
    if (await auth.checkUser(username, password)) {
      // return a user object if password matches
      return done(null, await db.getUser(username));
    }
    return done(null, false);
  } catch (err) {
    return done(err);
  }
}));

// serialize user object using username
passport.serializeUser((user, done) => done(null, user.username));

passport.deserializeUser(async (name, done) => {
  try {
    // deserialize user by pulling full user object from database using username
    return done(null, (await db.getUser(name)));
  } catch (err) {
    return done(err);
  }
});

module.exports = passport;
