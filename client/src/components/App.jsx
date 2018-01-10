import React from 'react';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      text: 'ayy lmao',
    };
  }

  render() {
    const { text } = this.state;
    return (
      <div>{text}</div>
    );
  }
}
