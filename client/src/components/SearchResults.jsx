import React from 'react';
import { Container } from 'reactstrap';
import MessageEntry from './MessageEntry.jsx'

export default class Search extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return(
      <div className="message-list-container">
        <Container>
          {this.props.messages.map(message => <MessageEntry message={message} key={message.id} />)}
        </Container>
      </div>
    )
  }
}