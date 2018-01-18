import React from 'react';
import { connect, sendMessage } from '../socketHelpers';
import { Input } from 'reactstrap';
import profanity from 'profanity-censor'
import { InputGroup,  InputGroupAddon, Input } from 'reactstrap';
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
        {
          text: 'You can ask me any questions!!',
          username: 'Slap-bot',
          id: 1,
          createdAt: new Date(),
          workspaceId: 0,
        },
      ],
      filteredMessages: null,
      users: [],
      workSpaces: [],
      query: '',
      lasteMessage: '',
      currentWorkSpaceId: 0,
      currentWorkSpaceName: '',
      currentUsername: this.props.location.state.username,
      currentUserId: 0
    };
  }

  componentDidMount() {
    let server = location.origin.replace(/^http/, 'ws');

    // connect to the websocket server
    connect(server, this);
    if (this.state.currentWorkSpaceId === 0) {
      document.getElementById('messageInput').setAttribute('disabled', 'disabled');
      document.getElementById('messageInput').setAttribute('placeholder', 'Select a Workspace to Chat!');
    }
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
        text: profanity.filter(this.state.query),
        workspaceId: this.state.currentWorkSpaceId,
      });
      // resets text box to blank string
      this.setState({lastMessage: this.state.query});
      this.setState({
        query: '',
      });
    }
  }

  getLastMessage(event) {
  if (event.keyCode === 38) {
      event.preventDefault();
      document.getElementById('messageInput').value = this.state.lastMessage;
      this.setState({query: this.state.lastMessage});
    }
  }

  //grabs all existing workspaces
  loadWorkSpaces() {
    fetch('/workspaces')
      .then(resp => resp.json())
      .then(workSpaces => this.setState({ workSpaces }))
      .catch(console.error);
  }

  //grabs all existing users
  loadUsers() {
    fetch('/users')
      .then(resp => resp.json())
      .then(users => {
        let currentUserId;
        //iterate through the users array to set the currentUserId(state)
        for (let i = 0; i < users.length; i++) {
          if (users[i].username === this.state.currentUsername) {
            currentUserId = users[i].id;
          }
        }

        let { ws } = this.state;
        //
        ws.userId = currentUserId;
        console.log('App ws: ', this.state.ws);
        this.setState({ users });
      })
      .catch(console.error);
  }

  //updates `this.currentUserId`


  //Helper function to reassign current workspace
  changeCurrentWorkSpace(id, name) {
    this.setState({ 
      currentWorkSpaceId: id, 
      currentWorkSpaceName: name, 
      filteredMessages: null 
    });
    document.getElementById('messageInput').removeAttribute('disabled');
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
      filteredMessages,
      query,
      workSpaces,
      currentWorkSpaceId,
      currentWorkSpaceName,
      users,
      currentUsername,
      currentUserId,
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
          users={users}
          username={currentUsername}
          userId={currentUserId}
        />
        <div id="input-container" className="input-container">
          <Input
            value={query}
            id="messageInput"
            className="message-input-box"
            type="textarea"
            name="text"
            placeholder={`Message #${currentWorkSpaceName}`}
            onChange={event => this.handleChange(event)}
            onKeyPress={event => this.handleKeyPress(event)}
            onKeyDown={event => this.getLastMessage(event)}
          />
        </div>
      </div>
    );
  }
}