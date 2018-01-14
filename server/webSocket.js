const WebSocket = require('ws');

const db = require('../database');

const response = (code, message, method, data) =>
  JSON.stringify({
    code,
    message,
    method,
    data,
  });

const updateEveryoneElse = (ws, wss, data) => {
  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

const onMessage = async (ws, wss, data) => {
  let message;
  try {
    message = JSON.parse(data);
  } catch (err) {
    return ws.send(response(400, err.message));
  }

  switch (message.method) {
    case 'GETMESSAGES':
      try {
        const messages = await db.getMessages(Number(message.data.workspaceId));
        return ws.send(response(200, 'Request success', message.method, messages));
      } catch (err) {
        return ws.send(response(400, err.stack, message.method));
      }
    case 'POSTMESSAGE':
      try {
        let postedMessage = await db.postMessage(
          message.data.text,
          message.data.username,
          message.data.workspaceId,
        );
        [postedMessage] = postedMessage.rows;
        ws.send(response(201, 'Post success', message.method, postedMessage));
        return updateEveryoneElse(
          ws,
          wss,
          response(200, 'New message', 'NEWMESSAGE', {
            message: postedMessage,
            workspaceId: message.data.workspaceId,
          }),
        );
      } catch (err) {
        return ws.send(response(400, err.stack, message.method));
      }
    default:
      return ws.send(response(405, 'Unknown method', message.method));
  }
};

const onConnect = (ws, wss) => {
  ws.on('message', data => onMessage(ws, wss, data));
};

module.exports = {
  onConnect,
};
