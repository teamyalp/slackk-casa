const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const db = require('../database');
const auth = require('./auth');

const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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

router.post('/recover', bodyParser.json());
router.post('/recover', async (req, res) => {
  try {
    const hint = await db.getPasswordHint(req.body.username);
    res.status(200).json(hint);
  } catch (err) {
    return res.status(500).json(err.stack);
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

module.exports = router;
