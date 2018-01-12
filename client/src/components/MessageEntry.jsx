import React from 'react';

export default ({ message }) => (
  <div className="message-entry-container">
    {message.username} -
    {message.text}
    <br />
    {message.createdAt}
  </div>
);
