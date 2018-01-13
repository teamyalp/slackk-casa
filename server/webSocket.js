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

const onMessage = (ws, wss, data) => {
  let message;
  try {
    message = JSON.parse(data);
  } catch (err) {
    return ws.send(response(400, err.message));
  }

  switch (message.method) {
    case 'GETMESSAGES':
      return db
        .getMessages(Number(message.data.workspaceId))
        .then(messages => ws.send(response(200, 'Request success', message.method, messages)))
        .catch(err => ws.send(response(400, err.stack, message.method)));
    case 'POSTMESSAGE':
      return db
        .postMessage(message.data.text, message.data.username, message.data.workspaceId)
        .then((dbData) => {
          const postMsgData = { message: dbData.rows[0], workspaceId: message.data.workspaceId };
          ws.send(response(201, 'Post success', message.method, dbData.rows[0]));
          return updateEveryoneElse(
            ws,
            wss,
            response(200, 'New message', 'NEWMESSAGE', postMsgData),
          );
        })
        .catch(err => ws.send(response(400, err.stack, message.method)));
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
