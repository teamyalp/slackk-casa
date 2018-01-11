import React from 'react';
import { connect, sendMessage } from '../socketHelpers';
import MessageList from './MessageList.jsx';
import { Button } from 'reactstrap';
import NavBar from './NavBar.jsx';
import Body from './Body.jsx';
import { Container, FormGroup, Label, Input } from 'reactstrap';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      // users: [],
      query: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    let server = 'wss://slackk-casa.herokuapp.com';
    // let server = location.origin.replace(/^http/, 'ws');
    // connect to the websocket server
    connect(server, this);
  }

  // sends the input field value as a json object to the server socket
  handleClick() {
    console.log('username: ', this.props.location.state.username);
    console.log('password: ', this.props.location.state.password);
    sendMessage(this.state.query);
  }

  handleChange(event) {
    this.setState({
      query: event.target.value,
    });
    console.log(this.state.query);
  }

  render() {
    let { messages } = this.state;
    return (
      <div>
        <NavBar />
        <Body messages={messages} />
        <div className="input-container">
          <FormGroup className="text-area">
            <Label for="exampleText">Text Area</Label>
            <Input type="textarea" name="text" id="exampleText" onChange={this.handleChange} />
          </FormGroup>
        </div>
        <button className="chat-send-button" onClick={() => this.handleClick()}>
          Send!
        </button>
      </div>
    );
  }
}
