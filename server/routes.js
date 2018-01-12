const express = require('express');
const path = require('path');
const db = require('../database');
const bodyParser = require('body-parser');

const router = express.Router();

const reactRoute = (req, res) => res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));

router.use(express.static(path.join(__dirname, '../client/dist')));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/signup', reactRoute);
router.get('/login', reactRoute);
router.get('/messages', reactRoute);

// maybe send err.code instead of 401.
router.post('/signup', (req, res) => {
  let { username, password } = req.body;
  let params = [username, password];
  db
    .createUser(params)
    .then((data, code) => {
      if (code === '23505') {
        res.status(400).send(JSON.stringify('username exists'));
      } else {
        res.sendStatus(200);
      }
    })
    .catch(err => res.status(401).send(err.message));
});

// check web socket connections
router.post('/login', (req, res) => {
  let { username, password } = req.body;
  let params = [username, password];
  db
    .checkUser(params)
    .then((data) => {
      if (data.rows.length === 0) {
        res.status(401).send(JSON.stringify('invalid login'));
      } else {
        res.sendStatus(201);
      }
    })
    .catch(err => console.error(err));
});

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
