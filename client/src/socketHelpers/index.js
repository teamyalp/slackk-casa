let ws = null;
let app = null;
let sent = false;
const beep = new Audio('/sounds/pling.wav'); // sound on receive msg
const oneup = new Audio('/sounds/coin.wav'); // sound on send msg

/* takes in an array of messages
  objects and sets the component state messages
  with the new array of messages recieved */
const loadMessages = (messages) => {
  console.log('heyy gurrll:, ', messages);
  app.setState({ messages });
};

/* takes in message as object
   msg ({id: INT, text: STRING, createdAt: DATE, workspaceId: INT})
   and concats message to message state of app */
const addNewMessage = (message) => {
  if (sent) {
    sent = false;
  } else {
    beep.play();
  }
  console.log('index.js @ 24 - addNewMessages - messages to state: ', message);
  app.setState({ messages: [...app.state.messages, message] });
};

// takes in an array of users and sets the current app state
const setUsers = (users) => {
  app.setState({ users });
};

// takes in a parameter and sends that parameter to the socket server
const sendMessage = (data) => {
  const msg = {
    method: 'POSTMESSAGE',
    data: {
      username: data.username,
      text: data.text,
      workspace: data.workspaceId,
    },
  };
  oneup.play();
  sent = true;
  ws.send(JSON.stringify(msg));
};

const sendDMessage = (data) => {
  const msg = {
    method: 'POSTDMESSAGE',
    data: {
      username: data.username,
      text: data.text,
      workspacename: data.workspacename,
      fromUser: data.fromUser,
      toUser: data.toUser,
    },
  };
  oneup.play();
  sent = true;
  ws.send(JSON.stringify(msg));
};

// const addClientInfo = (id) => {
//   //get id
//   //get current username (from state)
//   //add a property to an object (on state) for this current key(username)/value(id)

//   /*
//     When a user logouts and login, on server-side, the connectedClient array will assign the user a new id,

// //connectedClient = {1: ws(peter), 2: ws(chris)} - the one that logs on --> clientWS
//   //both users & connectedClient rely on counter for syncing
//     // start with users (current) --> pull WS' for each online user --> send (1) c-users & (2) corresponding WS' to state

// // hardcode online users array for testing purposes so that we update the users array state at App level
// const users = [
//   {id: 1, username: 'a'},
//   {id: 2, username: 'b'},
// ];

// //set app.state.users = users
// //set clientWS to the WS' that correspond with users  {1: WS(a), 2: WS(b)}
// // App ClientWS = {'a': 1, 'b': 2}
//   */
//   console.log('addClientInfo is firing: ', id, '-', users);
//   let { clientWS } = app.state;
//   clientWS[users[users.length - 1].username] = id;
//   app.setState({ clientWS });
// };

// takes a workspace Id as INT for parameter and returns the messages for that current workspace
const getWorkSpaceMessagesFromServer = (id) => {
  const msg = { method: 'GETMESSAGES', data: { workspaceId: id } };
  ws.send(JSON.stringify(msg));
};

// takes a workspace name as parameter and returns the direct-messages for that workspace
const getWorkSpaceDMessagesFromServer = (name) => {
  const msg = { method: 'GETDMESSAGES', data: { workspacename: name } };
  ws.send(JSON.stringify(msg));
};

// takes in all new messages and filters and concats messages that match the current workSpace
const filterMsgByWorkSpace = (msg) => {
  if (sent) {
    sent = false;
  } else {
    beep.play();
  }
  console.log('filterMsgByWorkspace index.js/helpers(102)', msg);
  // put this back
  if (msg.workspaceId === app.state.currentWorkSpaceId) {
    app.setState({ messages: [...app.state.messages, msg.message] });
  }
};

const filterMsgByWorkSpaceName = (msg) => {
  if (sent) {
    sent = false;
  } else {
    beep.play();
  }
  console.log('filterMsgByWorkspacename index.js/helpers(124)', msg);
  // put this back
  if (msg.workspacename === app.state.currentWorkSpaceName) {
    console.log('filterMsgByWorkspacename index.js/helpers(102)', 'fired!!!');
    app.setState({ messages: [...app.state.messages, msg.message] });
  }
};


// ws refers to websocket object
const afterConnect = () => {
  ws.onmessage = (event) => {
    let serverResp = JSON.parse(event.data);
    console.log('Message Sent From Server: ', serverResp);
    // TODO: better error handling. Temp till complete switch statements
    if (serverResp.code === 400) {
      // console.log(serverResp.method);
      throw serverResp.message;
    }
    console.log('afterConnect: ', serverResp);
    switch (serverResp.method) {
      case 'GETMESSAGES':
        loadMessages(serverResp.data);
        break;
      case 'GETDMESSAGES':
        console.log('GETDMESSAGES - serverResp.data:', serverResp.data);
        loadMessages(serverResp.data);
        break;
      case 'NEWMESSAGE':
        filterMsgByWorkSpace(serverResp.data);
        break;
      case 'NEWDMESSAGE': {
        console.log('this reached NEWDMESSAGE', serverResp.data);
        let workSpaces = app.state.workSpaces;
        workSpaces.push({ db_name: serverResp.data.message.createdAt, id: serverResp.data.message.id, name: serverResp.data.message.workspacename });
        app.setState({ workSpaces }, filterMsgByWorkSpaceName(serverResp.data));
        break;
      }
      case 'GETUSERS':
        setUsers(serverResp.data);
        break;
      case 'POSTMESSAGE':
        addNewMessage(serverResp.data);
        break;
      case 'POSTDMESSAGE':
        addNewMessage(serverResp.data);
        console.log('POSTDMESSAGE @ 167 (index.js/sockethelpers', serverResp.data);
        break;
      // case 'SENDCLIENTINFO':
      //   addClientInfo(serverResp.id, serverResp.users);
      //   break;
      default:
    }
  };
};

// takes in server ip or wss protocall to connect to server
// takes in component to have scope in function
const connect = (server, component) => {
  // create new socket server instance
  ws = new WebSocket(server);
  console.log('Connect method: ', ws);
  console.log('App: ', component);
  app = component;
  // on connection run the callback
  ws.addEventListener('open', () => {
    console.log('Connected to the server');
    // sets state to current socket session for App methods to have access
    app.setState({ ws });

    // gets workspaces after connection
    app.loadWorkSpaces();
    // gets users after connection
    app.loadUsers();

    // calls after connect function that takes in the socket session
    // and app component
    afterConnect();
  });
};

export { connect, sendMessage, afterConnect, getWorkSpaceMessagesFromServer, getWorkSpaceDMessagesFromServer, sendDMessage };
