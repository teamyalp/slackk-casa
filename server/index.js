const express = require('express');
const router = require('./routes');
const WebSocket = require('ws');
const { onConnect } = require('./webSocket');

const PORT = process.env.PORT || 3000;

const server = express()
  .use(router)
  .listen(PORT, () => console.log(`listenting on port ${PORT}`));

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => onConnect(ws, wss));

module.exports = server;
