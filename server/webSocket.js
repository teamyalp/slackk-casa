const WebSocket = require('ws');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const db = require('../database');

let counter = 1;
let connectedClient = {};
// creates a response object for sending to clients
/*
Object used for communication between server and clients through WebSockets -
{
  code: Only sent by server when responding to a request from a client, follows HTTP status code conventions
  message: Only sent by server when responding to a request from a client, text description of the code number
  method: Always required, dictates what the request/response is for (GETMESSAGES, POSTMESSAGE, NEWMESSAGE)
  data: Data required to process the request/response method
}
*/
const response = (code, message, method, data) =>
  JSON.stringify({
    code,
    message,
    method,
    data,
  });

// sends data to all clients except client ws
const updateEveryoneElse = (ws, wss, data) => {
  console.log('this is websocket data packet websocket.js @ 29', data);
  wss.clients.forEach((client) => {
    // console.log('these are clients:', client)
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

const updateEveryone = (ws, wss, data) => {
  console.log('this is websocket data packet websocket.js @ 39', data);
  wss.clients.forEach((client) => {
    // console.log('these are clients:', client)
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

// sends data to only direct-message clients
// ***********************TODO: filter by toUser and fromUser****************************
const updateDMUser = (ws, wss, data) => {
  console.log('webSocket.js @ 40', data);
  wss.clients.forEach((client) => {
    // && (connectedClient[fromUser] === client || connectedClient[toUser] === client)
    if (client = connectedClient[data.toUser] && client.readyState === WebSocket.OPEN) {
      client.send(data);
    } 
  });
};

// sends data only to clients that pass filter
// const updateDirectMsg = (ws, wss, data) => {
//   wss.clients.forEach((client) => {
//     if (client === ws || client.userId === && client.readyState === WebSocket.OPEN) {
//       client.send(data);
//     }
//   });
// };

// event handler for incoming data from any client
const onMessage = async (ws, wss, data) => {
  // console.log(ws);
  let message;
  try {
    // attempt to parse data from client, if unparseable responsd back with 400 and parsing error
    message = JSON.parse(data);
  } catch (err) {
    return ws.send(response(400, err.message));
  }

  // switch case to determine what to do with the message
  switch (message.method) {
    case 'GETMESSAGES':
      // method GETMESSAGES returns a list of previous messages for the given workspaceId
      /*
      Request from client to server:
      {
        method: 'GETMESSAGES',
        data: {
          workspaceId: 1, //request workspace's id
        }
      }
  
      Response from server to client:
      {
        code: 200,
        message: 'Request success',
        method: 'GETMESSAGES',
        data: [{  //return an array of message objects from the requested workspace
          id: 1,
          text: 'this is a test message',
          username: 'testUser',
          createdAt: '2018-01-15T20:15:29.269Z',
        }, ...],
      }
      */
      try {
        const messages = await db.getMessages(Number(message.data.workspaceId));
        // respond back to client with success response and list of messages if successfully pulled from database
        return ws.send(response(200, 'Request success', message.method, messages));
      } catch (err) {
        // respond back to client with error response and error message if messages can't be pulled from database
        return ws.send(response(400, err.stack, message.method));
      }
    case 'GETDMESSAGES':
      // method GETDMESSAGES returns a list of previous direct-messages for the given workspacename 

      try {
        console.log('webSocket.js-107: ', message);
        const messages = await db.getDMessages(message.data.workspacename);

        console.log('GETDMESSAGES WebSocket messages:', messages);
        // respond back to client with success response and list of messages if successfully pulled from database
        return ws.send(response(200, 'Request success', message.method, messages));
      } catch (err) {
        // respond back to client with error response and error message if messages can't be pulled from database
        return ws.send(response(400, err.stack, message.method));
      }
    case 'POSTMESSAGE':
      // method POSTMESSAGE posts a message to the workspace for the given workspaceId
      /*
      Request from client to server:
      {
        method: 'POSTMESSAGE',
        data: {
          text: 'test message',
          username: 'testUser',
          workspaceId: 1, //workspace id to post messsage to
        }
      }
  
      Direct Msg request from client to server:
      {
        method: 'POSTMESSAGE',
        data: {
          text: 'test message',
          username: 'testUser',
          workspaceId: 1, //workspace id to post messsage to
          otherUserId: 1, //user id to post message to
        }
      }
  
      Response from server to client:
      {
        code: 200,
        message: 'Post success',
        method: 'POSTMESSAGE',
        data: {  //return back the successfully posted message object
          id: 1,
          text: 'test message',
          username: 'testUser',
          createdAt: '2018-01-15T20:15:29.269Z',
        },
      }
      */
      try {
        // post the given message to the database
        let postedMessage = await db.postMessage(
          message.data.text,
          message.data.username,
          message.data.workspace,
        );
        //postedMessage = message object
        console.log('this is message data object; 161-websocket.js', message.data);
        // [postedMessage] = postedMessage.rows;
        // postedMessage = postedMessage.rows[0]X;
        // if (postedMessage) {
        //   console.log('this is result from db.postMessage (data.rows) :', postedMessage);
        // }

        // respond back to client with success response and list of messages if successfully posted to the database
        ws.send(response(201, 'Post success', message.method, postedMessage));
        // notify all other connected clients that a new message has been posted with a NEWMESSAGE response
        /*
        Request from server to client:
        {
          method: 'NEWMESSAGE',
          data: {  //send the new message to all other clients along with workspaceId of message
            message: {
              id: 1,
              text: 'test message',
              username: 'testUser',
              createdAt: '2018-01-15T20:15:29.269Z',
            },
            workspaceId: 1,
          },
        }
        */
        return updateEveryoneElse(
          ws,
          wss,
          response(200, 'New message', 'NEWMESSAGE', {
            message: postedMessage,
            workspaceId: message.data.workspaceId,
          }),
        );
      } catch (err) {
        // respond back to client with error response and error message if message can't be posted to database
        return ws.send(response(400, err.stack, message.method));
      }

    case 'POSTDMESSAGE':
      // method POSTDMESSAGE posts a direct message to the "dmessages" table

      try {
        // post the given message to the database
        let postedMessage = await db.postDMessage(
          message.data.text,
          message.data.username,
          message.data.workspacename,
        );

        //postedMessage is an object within array;
        console.log('this is message data object; 210-websocket.js', message.data);
        // [postedMessage] = postedMessage.rows;
        // respond back to client with success response and list of messages if successfully posted to the database
        ws.send(response(201, 'Post success', message.method, postedMessage[0]));
        // notify all other connected clients that a new message has been posted with a NEWMESSAGE response
        /*
        Request from server to client:
        {
          method: 'NEWMESSAGE',
          data: {  //send the new message to all other clients along with workspaceId of message
            message: {
              id: 1,
              text: 'test message',
              username: 'testUser',
              createdAt: '2018-01-15T20:15:29.269Z',
            },
            workspaceId: 1,
          },
        }
        */
        return updateDMUser(
          ws,
          wss,
          response(200, 'New message', 'NEWDMESSAGE', {
            message: postedMessage[0],
            workspaceName: message.data.workspacename,
            fromUser: message.data.fromUser,
            toUser: message.data.toUser,
          }),
        );
      } catch (err) {
        // respond back to client with error response and error message if message can't be posted to database
        return ws.send(response(400, err.stack, message.method));
      }

    default:
      // unknown message sent to server, respond back to client
      return ws.send(response(405, 'Unknown method', message.method));
  }
};

/*
  -> on web socket client connect, store the key(id)-value(ws) mapping into an object({})
  -> define a global variable counter and initialize it to zero (let counter = 0)
  (i.e.):
    connectedClients = {
      0: ws,
      1: ws,
      ...
    }

  -> 

*/

// hardcode online users array for testing purposes so that we update the users array state at App level
const users = [
  {id: 1, username: '1'},
  {id: 2, username: 'a'},
];


// event handler for when client connects to websocket server
// ws will be an object
// data will contain additional data (ie. toUser, fromUser)
const onConnect = (ws, req, wss) => {
  // console.log('Server-webSocket.js: ', req.session.user);
  // console.log('yooo: ', req.session);
  // cookieParser(req, {}, (err, req) => {
  //   session(req, {}, (err, req) => {
  //     console.log('Req: ', req);
  //     // req.sessions
  //   });
  // });
  connectedClient[counter] = ws;
  // build ontop of this
  // ws.send(JSON.stringify({ id: counter, method: 'SENDCLIENTINFO' }));
  
  console.log('Server webSocket.js-283: ', connectedClient);
  
  updateEveryone(ws, wss, JSON.stringify({ id: counter, method: 'SENDCLIENTINFO', users }));
  counter++;

  // console.log('this is WS:', ws);
  // console.log('this is connected Client:', connectedClient)
  // connectedClient.push({ userId: req.session.passport.user, ws: ws });
  // console.log(connectedClient);
  // attaches event handler for when client sends message to server
  ws.on('message', data => onMessage(ws, wss, data));
};

module.exports = {
  onConnect,
};
