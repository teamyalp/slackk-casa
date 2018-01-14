const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const db = require('../database');
const auth = require('./auth');

const router = express.Router();

const reactRoute = (req, res) => res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));

router.use(express.static(path.join(__dirname, '../client/dist')));

router.get('/signup', reactRoute);
router.get('/login', reactRoute);
router.get('/messages', reactRoute);

router.get('/workspaces', async (req, res) => {
  try {
    res.status(200).json(await db.getWorkspaces());
  } catch (err) {
    res.status(500).json(err.stack);
  }
});

router.post('/signup', bodyParser.json());
router.post('/signup', async (req, res) => {
  try {
    if (await db.getUser(req.body.username)) {
      return res.status(400).json('username exists');
    }
    await auth.addUser(req.body.username, req.body.password);
    return res.sendStatus(200);
  } catch (err) {
    return res.status(401).json(err.stack);
  }
});

router.post('/login', bodyParser.json());
router.post('/login', async (req, res) => {
  try {
    if (await auth.checkUser(req.body.username, req.body.password)) {
      return res.sendStatus(201);
    }
    return res.sendStatus(401);
  } catch (err) {
    return res.status(401).json(err.stack);
  }
});

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
