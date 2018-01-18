import React from 'react';
import { Container, ListGroup } from 'reactstrap';
import MessageEntry from './MessageEntry.jsx';

//container for message components
export default ({ messages, currentWorkSpaceId, directMessage }) => (
  <div className="message-list-container" id="messages">
    <Container>
      {
        messages.map((message, i) => {
          var sameUser = false;
          if (i > 0 && message.username === messages[i - 1].username) {
            sameUser = true;
          } else {
            sameUser = false;
          }
          return <MessageEntry sameUser={sameUser} message={message} key={message.id} />
        })
      }
    </Container>
  </div>
);