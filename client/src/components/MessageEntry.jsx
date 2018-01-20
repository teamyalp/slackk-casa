import React from 'react';
import { Container, Media } from 'reactstrap';

//Individual message container
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleHover: false,
    };
  }

  toggleHover() {
    this.setState({ toggleHover: !this.state.toggleHover });
  }

  render() {
    const { message, directMessage } = this.props;
    //for the color changing avatars
    let color = () => {
      let colors = [
        '#346A85',
        '#AFE356',
        '#348569',
        '#F6a43D',
        '#AAD3E6',
        '#7F3485',
        '#992B41',
        '#3B94D9',
        '#E95F28',
        '#4A913C',
        '#FFAC33',
        '#8899A6',
        '#744EAA',
        '#BE1931',
      ];
      let index = Math.floor(Math.random() * colors.length);
      return colors[index];
    };
    //Styles for individual message component
    const styles = {
      body: {
        padding: '15px 0 15px 0',
      },
      timeStamp: {
        fontSize: '10px',
        color: '#bdbdbd',
        marginLeft: '10px',
      },
      username: {
        fontSize: '24',
        fontWeight: 'bold',
        display: 'block',
        paddingBottom: '5px',
      },
      message: {
        fontSize: '0.9em',
        overflowWrap: 'break-word',
        textAlign: 'left',
        display: 'fixed',
        left: '63.99',
      },
      sameUserMessage: {
        fontSize: '0.9em',
        overflowWrap: 'break-word',
        textAlign: 'left',
        display: 'fixed',
        position: 'relative',
        left: '70px',
        marginTop: '-5px'
      },
      egg: {
        backgroundColor: color(),
        float: 'left',
        marginRight: '7px',
      },
    };

    var messageElement;
    if (this.props.sameUser) {
      if (message.text.substr(0, 4) === 'http') {
        messageElement = <img src={message.text} />
      } else {
        messageElement = <span style={styles.sameUserMessage}>{message.text}</span>
      }
    } else {
      if (message.text.substr(0, 4) === 'http') {
        messageElement = <Container style={styles.body}>
          <Media left href="#">
            <img
              className="egg img-responsive"
              href="#"
              src="/images/twitter-egg.png"
              alt="profile-pic"
              style={styles.egg}
            />
          </Media>
          <span style={styles.username}>
            {message.username}
            <span style={styles.timeStamp}>{new Date(message.createdAt).toLocaleTimeString()}</span>
          </span>
          <div style={styles.message}><img src={message.text} /></div>
        </Container>
      } else {
      messageElement = <Container style={styles.body}>
        <Media left href="#">
          <img
            className="egg img-responsive"
            href="#"
            src="/images/twitter-egg.png"
            alt="profile-pic"
            style={styles.egg}
          />
        </Media>
        <span style={styles.username} onClick={directMessage}>
          {message.username}
          <span style={styles.timeStamp}>{new Date(message.createdAt).toLocaleTimeString()}</span>
        </span>
        <div style={styles.message}>{message.text}</div>
      </Container>
      }
    }

    return (
      <div className="message-entry-container">
        {messageElement}
      </div>
    );
  }
}
