const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');

const db = require('../database');
const auth = require('./auth');
const passport = require('./passport');
const email = require('./email');

/*
  Express routes
*/

const router = express.Router();

router.use(cookieParser());
router.use(session({ secret: 'slackk-casa', resave: false, saveUninitialized: false }));
router.use(passport.initialize());
router.use(passport.session());

// helper response function to redirect react router paths to index.html
const reactRoute = (req, res) => res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));

router.use(express.static(path.join(__dirname, '../client/dist')));

// send index.html for react router's routes
router.get('/signup', reactRoute);
router.get('/login', reactRoute);
router.get('/messages', passport.authenticate('local', { failureRedirect: '/login' }), reactRoute);

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
    email.sendWelcomeEmail(req.body.username, req.body.email).then().catch();
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
router.post('/login', passport.authenticate('local'), async (req, res) => {
  try {
    const user = await db.getUser(req.body.username);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    // console.log('**********', req.session);
    //user: req.session.passport.user

    return res.status(200).json(user);
  } catch (err) {
    return res.status(401).json(err.stack);
  }
});

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
    return res.status(200).json(hint);
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
    return res.status(200).json(await db.getWorkspaces());
  } catch (err) {
    return res.status(500).json(err.stack);
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
    if (workspaces.find(workspace => workspace.name.toLowerCase() === req.body.name.toLowerCase())) {
      return res.status(400).json('workspace exists');
    }
    await db.createWorkspace(req.body.name);
    return res.sendStatus(201);
  } catch (err) {
    return res.status(500).json(err.stack);
  }
});

router.post('/search', bodyParser.json());
router.post('/search', async (req, res) => {
  try {
    const messages = await db.getMessages(req.body.workspaceId);
    return res.status(201).json(messages);
  } catch (err) {
    return res.status(500).json(err.stack);
  }
});

// GET request to /users, return array of users
/*
  Returns to client array of users objects
  [
    {
      id: 1,  // user id
      username: 'peter',  // workspace user name
    }
  ]
*/
router.get('/users', async (req, res) => {
  try {
    return res.status(200).json(await db.getUsers());
  } catch (err) {
    return res.status(500).json(err.stack);
  }
});

// POST request to /workspaces + /directmsg
router.post('/directmsg', bodyParser.json());
router.post('/directmsg', async (req, res) => {
  try {
    const workspaces = await db.getWorkspaces();
    if (
      workspaces.find(workspace => workspace.name.toLowerCase() === req.body.name.toLowerCase())
    ) {
      return res.status(400).json('workspace exists');
    }
    const { toUser, fromUser, name } = req.body;
    await db.createWorkspace(name);
    console.log('Routes: ', 'Createdworkspace');
    await db.postDUser(toUser, name);
    await db.postDUser(fromUser, name);
    return res.sendStatus(201);
//GET request to /profile, return profile object
router.get('/profile', async (req, res) => {
//GET request to /profile, provide username, return profile object
router.get('/profile/:username', async (req, res) => {
  try {
    return res.status(201).json(await db.getProfile(req.params.username));
  } catch (err) {
    return res.status(500).json(err.stack);
  }
});

//POST request to /profile, used to update EXISTING profile record
/*
  Request object from client:
  {
    username: 'username',
    fullname: 'fullname',
    status: 'current status/activity',
    bio: 'short bio',
    phone: 'phone number'
  }

  Server response status codes:
    - 201 - 
    - 400 - 
    - 500 - Database error, all other errors
*/
router.post('/profile', bodyParser.json());
router.post('/profile', async (req, res) => {
  try {
    const profile = await db.getProfile(req.body.username);
    if (profile) {
      console.log('PROFILE EXISTS, NOW UPDATING')
      return res.status(200).json(await db.updateProfile(req.body.username, req.body.fullname, req.body.status, req.body.bio, req.body.phone));
    } else {
      console.log('CREATING NEW PROFILE')
      return res.status(200).json(await db.createProfile(req.body.username, req.body.fullname, req.body.status, req.body.bio, req.body.phone));
    }
  } catch (err) {
    return res.status(500).json(err.stack);
  }
});
    

//POST request to /profile/image, send API request, receive returned image url
router.post('/profile/image', )

module.exports = router;
