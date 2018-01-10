import React from 'react';
import { connect, sendMessage } from '../socketHelpers';
import MessageList from './MessageList.jsx';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      // users: [],
    };
  }

  componentDidMount() {
    let server = location.origin.replace(/^http/, 'ws');

    // connect to the websocket server
    connect(server, this);
  }

  // sends the input field value as a json object to the server socket
  handleClick() {
    sendMessage(this.textInput.value);
  }

  render() {
    let { messages } = this.state;
    return (
      <div>
        <input
          type="text"
          ref={(input) => {
            this.textInput = input;
          }}
        />
        <button onClick={() => this.handleClick()}>Send!</button>
        <MessageList messages={messages} />
      </div>
    );
  }
}
