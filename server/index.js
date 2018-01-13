const express = require('express');
const WebSocket = require('ws');
const router = require('./routes');
const { onConnect } = require('./webSocket');

const PORT = process.env.PORT || 3000;

const server = express()
  .use(router)
  .listen(PORT, () => console.log(`slackk-casa listening on port ${PORT}`));

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => onConnect(ws, wss));

module.exports = server;
