import React from 'react';
import { Container } from 'reactstrap';

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
    const { message } = this.props;
    const styles = {
      body: {
        padding: '15px 0 15px 0',
      },
      timeStamp: {
        float: 'right',
        fontSize: '12px',
      },
      username: {
        fontSize: '24',
        fontWeight: 'bold',
        display: 'block',
        paddingBottom: '5px',
      },
      message: {
        fontSize: '20',
      },
    };
    return (
      <div className="message-entry-container">
        <Container style={styles.body}>
          <span style={styles.username}>{message.username}</span>
          <span style={styles.message}>{message.text}</span>
          <span style={styles.timeStamp}>{new Date(message.createdAt).toLocaleTimeString()}</span>
        </Container>
      </div>
    );
  }
}
