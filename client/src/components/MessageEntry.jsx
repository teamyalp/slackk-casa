import React from 'react';

export default ({ message }) => (
  <div>
    {message.text}
    <br />
    {message.createdAt}
  </div>
);
