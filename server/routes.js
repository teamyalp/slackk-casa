const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser');

const db = require('../database');
const auth = require('./auth');

// settings used for nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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

/*
  Express routes
*/

const router = express.Router();

router.use(cookieParser());
router.use(session({ secret: 'slackk-casa' }));
router.use(passport.initialize());
router.use(passport.session());

// helper response function to redirect react router paths to index.html
const reactRoute = (req, res) => res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));

router.use(express.static(path.join(__dirname, '../client/dist')));

// send index.html for react router's routes
router.get('/signup', reactRoute);
router.get('/login', reactRoute);
router.get('/messages', reactRoute);

// POST request to /signup, used to register users
/*
  Request object from client
  {
    username: 'testUser',
    password: 'mypassword',
    email: 'test@test.com',
    passwordHint: 'favorite hobby',
  }

  Server response status codes:
    - 200 - User successfully created
    - 400 - Username already exists
    - 401 - Database error, all other errors
*/
router.post('/signup', bodyParser.json());
router.post('/signup', async (req, res) => {
  try {
    if (await db.getUser(req.body.username)) {
      return res.status(400).json('username exists');
    }
    await auth.addUser(req.body.username, req.body.password, req.body.email, req.body.passwordHint);
    let mailOptions = {
      from: `${process.env.EMAIL_USERNAME}`,
      to: `${req.body.email}`,
      subject: `Welcome to slackk-casa! ${req.body.username}`,
      text: 'Thanks for joining slackk-casa! We hope you have a great time using our service!',
      html: 'Thanks for joining slackk! We hope you have a great time.</p>',
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        throw error;
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
    return res.sendStatus(200);
  } catch (err) {
    return res.status(401).json(err.stack);
  }
});

// POST request to /login, used to authenticate users
/*
  Request object from client:
  {
    username: 'testUser',
    password: 'mypassword',
  }

  Server response status codes:
    - 200 - Successfully authenticated
    - 401 - User login incorrect
*/
router.post('/login', bodyParser.json());
router.post('/login', passport.authenticate('local'), (req, res) => res.sendStatus(200));

// POST request to /recover, used to get password hint for user
/*
  Request object from client:
  {
    username: 'testUser',
  }

  Server response to client
  {
    password_hint: 'favorite hobby',
  }

  Server response status codes:
  - 500 - Database error, all other errors
*/
router.post('/recover', bodyParser.json());
router.post('/recover', async (req, res) => {
  try {
    const hint = await db.getPasswordHint(req.body.username);
    res.status(200).json(hint);
  } catch (err) {
    return res.status(500).json(err.stack);
  }
});

// GET request to /workspaces, return array of workspaces
/*
  Returns to client array of workspace objects
  [
    {
      id: 1,  // workspace id
      name: 'testWorkspace',  // workspace display name
      db_name: 'ws_t1516045064857',  // name of table for workspace's messages
    }
  ]
*/
router.get('/workspaces', async (req, res) => {
  try {
    res.status(200).json(await db.getWorkspaces());
  } catch (err) {
    res.status(500).json(err.stack);
  }
});

// POST request to /workspaces, used to create a new workspace
/*
  Request object from client:
  {
    name: 'my workspace', //name of workspace to create
  }

  Server response status codes:
    - 201 - Workspace successfuly created
    - 400 - Workspace already exists
    - 500 - Database error, all other errors
*/
router.post('/workspaces', bodyParser.json());
router.post('/workspaces', async (req, res) => {
  try {
    const workspaces = await db.getWorkspaces();
    if (
      workspaces.find(workspace => workspace.name.toLowerCase() === req.body.name.toLowerCase())
    ) {
      return res.status(400).json('workspace exists');
    }
    await db.createWorkspace(req.body.name);
    return res.sendStatus(201);
  } catch (err) {
    return res.status(500).json(err.stack);
  }
});

module.exports = router;

// sends an email every ___ to a list of all emails grabbed from the database.
// const parseEmails = (emailList) => {
//   let emails = [];
//   emailList.map(emailObj => {
//     emails.push(emailObj.email);
//   });
//   return emails.join(', ');
// }
//
// new CronJob('* * * * * *', function() {
//   db.getEmails()
//   .then(data => {
//     let emails = parseEmails(data);
//     console.log(emails);
//     let mailOptions = {
//       from : 'slackkcasa@gmail.com',
//       to: emails,
//       subject: 'testing',
//       text: 'test',
//       html: '<p>test</p>',
//     };
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error(error);
//       }
//     });
//   })
//   .catch(err => console.error(err));
// }, null, true, 'America/Los_Angeles');
