const express = require('express');
const router = require('./routes');
const http = require('http');
const WebSocket = require('ws');
const { onConnect } = require('./webSocket');

const app = express();
app.use(router);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
server.on('request', app);

wss.on('connection', ws => onConnect(ws, wss));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`listenting on port ${PORT}`));
