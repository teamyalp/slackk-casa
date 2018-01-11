import React from 'react';
import MessageEntry from './MessageEntry.jsx';

export default ({ messages }) => (
  <div className="message-list-container">
    {messages.map(message => <MessageEntry message={message} key={message.id} />)}
  </div>
);
