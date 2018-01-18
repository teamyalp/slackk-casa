import React from 'react';
import { Container, ListGroup } from 'reactstrap';
import MessageEntry from './MessageEntry.jsx';

//container for message components
export default ({ messages, currentWorkSpaceId }) => (
  <div className="message-list-container">
    <Container>
      {
        messages.map((message, i) => {
          var sameUser = false;
          console.log(i, message)
          if (i > 0 && message.username === messages[i - 1].username && messages.length > 0) {
            sameUser = true;
          } else {
            console.log('not same')
            sameUser = false;
          }
          return <MessageEntry sameUser={sameUser} message={message} key={message.id} />
        })}
    </Container>
  </div>
);