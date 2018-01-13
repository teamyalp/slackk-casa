const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const db = require('../database');
const auth = require('./auth');

const router = express.Router();

const reactRoute = (req, res) => res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));

router.use(express.static(path.join(__dirname, '../client/dist')));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/signup', reactRoute);
router.get('/login', reactRoute);
router.get('/messages', reactRoute);

router.post('/signup', (req, res) =>
  auth
    .addUser(req.body.username, req.body.password)
    .then((data, code) =>
      (code === '23505' ? res.status(400).json('username exists') : res.sendStatus(200)))
    .catch(err => res.status(401).json(err.stack)));

router.post('/login', (req, res) =>
  auth
    .checkUser(req.body.username, req.body.password)
    .then(loggedIn => (loggedIn ? res.sendStatus(201) : res.sendStatus(401)))
    .catch(err => res.status(401).json(err.stack)));

router.get('/workspaces', (req, res) =>
  db
    .getWorkspaces()
    .then(data => res.status(200).send(JSON.stringify(data)))
    .catch(error => res.status(500).send(JSON.stringify(error.stack))));

router.post('/workspaces', (req, res) =>
  db
    .createWorkspace(req.body.name)
    .then(() => res.sendStatus(201))
    .catch(error => res.status(500).send(JSON.stringify(error.stack))));

module.exports = router;
