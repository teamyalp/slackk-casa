import React from 'react';
import profanity from 'profanity-censor'
import { connect, sendMessage, sendDMessage } from '../socketHelpers';
import { InputGroup,  InputGroupAddon, Input } from 'reactstrap';
import axios from 'axios';
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
      currentToUser: '',
      //key = username; value = clientWS ID
      // currentUserId: 0
    };
    this.changeDirectMessageUser = this.changeDirectMessageUser.bind(this);
  }

  componentDidMount() {
    console.log('APP USERNAME', this.props)

    let server = location.origin.replace(/^http/, 'ws');
    // console.log(this.props);
    // console.log(this.state);
    // server += this.state.currentUserId;
    // console.log('componentDidMount: ', this.state.currentUserId);
    // console.log('componentDidMount: ', this.state.currentUsername);
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
    console.log(this.state.query)
  }

  // sends message on enter key pressed and clears form
  // only when shift+enter pressed breaks to new line
  handleKeyPress(event) {
    // on key press enter send message and reset text box
    if (this.state.currentWorkSpaceName.includes('-')) {
          console.log('enter')
      if (event.charCode === 13 && !event.shiftKey) {
        event.preventDefault();
        sendDMessage({
          username: this.props.location.state.username,
          text: this.state.query,
          workspacename: this.state.currentWorkSpaceName,
          workspaceId: this.state.currentWorkSpaceId,
          //how to send the address? sending IDs;
        });
        // resets text box to blank string
        this.setState({
          query: '',
        });
      }
    } else {
      if (event.charCode === 13 && !event.shiftKey) {
        event.preventDefault();
        if (this.state.query.split('')[0] === '/' || this.state.query.split('')[0] === ':') {
          this.renderText(renderedText => {
            sendMessage({
              username: this.props.location.state.username,
              text: renderedText,
              workspaceId: this.state.currentWorkSpaceId,
            });
          })
        } else {
          sendMessage({
            username: this.props.location.state.username,
            text: profanity.filter(this.state.query),
            workspaceId: this.state.currentWorkSpaceId,
          });
        }
        // resets text box to blank string
        this.setState({lastMessage: this.state.query});
        this.setState({
          query: '',
        });
      }
    } 
  }

  getLastMessage(event) {
  if (event.keyCode === 38) {
    console.log('lastMessage')
      event.preventDefault();
      document.getElementById('messageInput').value = this.state.lastMessage;
      this.setState({query: this.state.lastMessage});
    }
  }

  renderText(cb) {
    let command = this.state.query.substr(1);
    let param = this.state.query.split(' ')[1];
    console.log(param)
    let commandObj = {
      angry: '( ͡° ʖ̯ ͡°)',
      shrug: '¯\\_(ツ)_/¯',
      creepy: '( ͡° ͜ʖ ( ͡° ͜ʖ ( ͡° ͜ʖ ( ͡° ͜ʖ ͡°) ͜ʖ ͡°)ʖ ͡°)ʖ ͡°)',
      cry: '( T ʖ̯ T)',
      glasses: '(̿▀̿ ̿Ĺ̯̿̿▀̿ ̿)̄',
      flipoff: '凸( ͡° ͜ʖ ͡°)',
      cat: 'ʢ◉ᴥ◉ʡ',
      happy: '^‿^'
    }
    if (commandObj[command]) {
      cb(commandObj[command])
    } else if (command.startsWith('giphy')) {
      this.getGiphy(param, (url) => {
        cb(url);
      })
    } else {
      cb(this.state.query)
    }
  }

  getGiphy(param, cb) {
    axios.get(`http://api.giphy.com/v1/gifs/random?api_key=4SmUSyBG0eQCgx9Juz77LHHRkc1a2mYe&tag=ass`)
      .then(function (response) {
        console.log(response.data.data.image_original_url)
        cb(response.data.data.image_original_url)
      })
      .catch(function (error) {
        console.log(error);
      });
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
      .then(users => this.setState({ users }))
      .catch(console.error);
  }

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

  changeDirectMessageUser(toUser) {
    this.setState({currentToUser: toUser}, () => console.log('toUser is set in state', toUser));
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
    console.log('App.jsx-220 WS: ', this.state.clientWS);
    return (
      <div className="app-container">
        <NavBar 
          filteredMessages={filteredMessages}
          currentWorkSpaceName={currentWorkSpaceName} 
          searchClick={this.searchClick.bind(this)}
          user={this.props.location.state}
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
          changeDirectMessageUser={this.changeDirectMessageUser}
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
