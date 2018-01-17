import React from 'react';
import { connect, sendMessage } from '../socketHelpers';
import { Input } from 'reactstrap';
import EmojiPicker from "rm-emoji-picker";
import NavBar from './NavBar.jsx';
import MessageList from './MessageList.jsx';
import Body from './Body.jsx';

//The main component of the App. Renders the core functionality of the project.
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //Default message informs the user to select a workspace
      messages: [
        {
          text: 'Welcome to Slap! Please select or create a workspace!',
          username: 'Slap-bot',
          id: 0,
          createdAt: new Date(),
          workspaceId: 0,
        },
      ],
      filteredMessages: null,
      users: [],
      workSpaces: [],
      query: '',
      currentWorkSpaceId: 0,
      currentWorkSpaceName: '',
    };
  }

  componentDidMount() {
    let server = location.origin.replace(/^http/, 'ws');

    // connect to the websocket server
    connect(server, this);

    // instantiate emojiPicker
    const picker = new EmojiPicker();
    const icon      = document.getElementById('showEmojis');
    const container = document.getElementById('input-container');
    const editable  = document.getElementById('messageInput');
    picker.listenOn(icon, container, editable);
  }

  // changes the query state based on user input in text field
  handleChange(event) {
    this.setState({
      query: event.target.value,
    });
  }

  // sends message on enter key pressed and clears form
  // only when shift+enter pressed breaks to new line
  handleKeyPress(event) {
    // on key press enter send message and reset text box
    if (event.charCode === 13 && !event.shiftKey) {
      event.preventDefault();
      sendMessage({
        username: this.props.location.state.username,
        text: this.state.query,
        workspaceId: this.state.currentWorkSpaceId,
      });
      // resets text box to blank string
      this.setState({
        query: '',
      });
    }


  }
  //grabs all existing workspaces
  loadWorkSpaces() {
    fetch('/workspaces')
      .then(resp => resp.json())
      .then(workSpaces => this.setState({ workSpaces }))
      .catch(console.error);
  }

  //Helper function to reassign current workspace
  changeCurrentWorkSpace(id, name) {
    this.setState({ 
      currentWorkSpaceId: id, 
      currentWorkSpaceName: name, 
      filteredMessages: null 
    });
  }

  //*new*
  searchClick(e, searchTerm) {
    this.state.filteredMessages = null;
    let filteredMessages = [];
    this.state.messages.map(message => {
      let messageWordArr = [];
      messageWordArr = messageWordArr.concat(message.text.split(' '));
      messageWordArr.map(word => {
        if (word.toLowerCase() === searchTerm.toLowerCase()) {
          filteredMessages.push(message);
        }
      })
    })
    this.setState({filteredMessages: filteredMessages});
  }


  //renders nav bar, body(which contains all message components other than input), and message input
  render() {
    let {
      messages, 
      query, workSpaces, 
      currentWorkSpaceId, 
      currentWorkSpaceName, 
      filteredMessages
    } = this.state;
    return (
      <div className="app-container">
        <NavBar 
          filteredMessages={filteredMessages}
          currentWorkSpaceName={currentWorkSpaceName} 
          searchClick={this.searchClick.bind(this)}
        />
        <Body
          messages={messages}
          filteredMessages={filteredMessages}
          workSpaces={workSpaces}
          loadWorkSpaces={() => this.loadWorkSpaces()}
          changeCurrentWorkSpace={(id, name) => this.changeCurrentWorkSpace(id, name)}
          currentWorkSpaceId={currentWorkSpaceId}
        />
        <div id="input-container" className="input-container">
          <button id="showEmojis">:D</button>
          <Input
            value={query}
            id="messageInput"
            className="message-input-box"
            type="textarea"
            name="text"
            placeholder={`Message #${currentWorkSpaceName || 'select a workspace!'}`}
            onChange={event => this.handleChange(event)}
            onKeyPress={event => this.handleKeyPress(event)}
          />
        </div>
      </div>
    );
  }
}