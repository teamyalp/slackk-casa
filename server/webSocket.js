const WebSocket = require('ws');

const db = require('../database');

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
  } catch (e) {
    return ws.send(JSON.stringify({
      code: 400,
      message: e.message,
    }));
  }

  switch (message.method) {
    case 'GETMESSAGES':
      db
        .getMessages()
        .then(messages =>
          ws.send(JSON.stringify({
            code: 200,
            message: 'Request success',
            method: 'GETMESSAGES',
            data: messages,
          })))
        .catch(err =>
          ws.send(JSON.stringify({
            code: 400,
            message: err.message,
            method: 'GETMESSAGES',
          })));
      break;
    case 'POSTMESSAGE':
      db
        .postMessage(message.data.text)
        .then(dbData =>
          updateEveryoneElse(
            ws,
            wss,
            JSON.stringify({
              code: 200,
              message: 'New message',
              method: 'NEWMESSAGE',
              data: {
                id: dbData.rows[0].id,
                text: dbData.rows[0].text,
                createdAt: dbData.rows[0].createdAt,
              },
            }),
          ))
        .then(() =>
          ws.send(JSON.stringify({
            code: 201,
            message: 'Post success',
            method: 'POSTMESSAGE',
          })))
        .catch(err =>
          ws.send(JSON.stringify({
            code: 400,
            message: err.message,
            method: 'POSTMESSAGE',
          })));
      break;
    default:
  }
};

const onConnect = (ws, wss) => {
  ws.on('message', data => onMessage(ws, wss, data));
};

module.exports = {
  onConnect,
};
