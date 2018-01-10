let ws = null;
let app = null;

// takes in an array of messages
// objects and sets the component state messages
// with the new array of messages recieved
const addNewMessages = (messages) => {
  app.setState({ messages });
};

// takes in message as object
// msg ({id: #, text: '', createdAt: date})
// and concats message to message state of app
const addNewMessage = (message) => {
  app.setState({ messages: [...app.state.messages, message] });
};

// not handling users yet
// const setUsers = (app, users) => {
//   app.setState({ users });
// }

// takes in a parameter and sends that parameter to the socket server
const sendMessage = (data) => {
  const msg = {
    method: 'POSTMESSAGE',
    data: {
      text: data,
    },
  };
  ws.send(JSON.stringify(msg));
};

// ws refers to websocket object
const afterConnect = () => {
  const getMessages = JSON.stringify({ method: 'GETMESSAGES' });
  ws.send(getMessages);
  ws.onmessage = (event) => {
    let serverResp = JSON.parse(event.data);

    // TODO: better error handling. Temp till complete switch statements
    if (serverResp.code === 400) {
      console.log(serverResp.method);
      throw serverResp.message;
    }

    switch (serverResp.method) {
      case 'GETMESSAGES':
        // render all messages
        addNewMessages(serverResp.data);
        break;
      case 'NEWMESSAGE':
        // concat new message onto messages array in state
        addNewMessage(serverResp.data);
        break;
      case 'GETUSERS':
        app.setState({ users: serverResp.data });
        break;
      case 'POSTMESSAGE':
        addNewMessage(serverResp.data);
        break;
      default:
    }
  };
};

// takes in server ip or wss protocall to connect to server
// takes in component to have scope in function
const connect = (server, component) => {
  // create new socket server instance
  ws = new WebSocket(server);
  app = component;
  // on connection run the callback
  ws.addEventListener('open', () => {
    console.log('Connected to the server');
    // sets state to current socket session for App methods to have access
    app.setState({ ws });
    // calls after connect function that takes in the socket session
    // and app component
    afterConnect();
  });
};

export { connect, sendMessage, afterConnect };
