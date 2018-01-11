import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import App from './App.jsx';
import { BrowserRouter as Router, Route } from 'react-router-dom';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'Guest',
      password: '',
    };

    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
  }

  onClick() {
    console.log('logging in');
  }

  handleUsername(event) {
    this.setState({
      username: event.target.value,
    });
    console.log(this.state.username);
  }

  handlePassword(event) {
    this.setState({
      password: event.target.value,
    });
    console.log(this.state.password);
  }


  render() {
    return (
      <div className="nav">
        User:
        <input type="text" className="username-input" onChange={this.handleUsername} />
        Password:
        <input type="text" className="password-input" onChange={this.handlePassword} />
        <Link to={{pathname: '/messages', state: {username: this.state.username, password: this.state.password}}}><button onClick={() => this.onClick()}>Log in!</button></Link>
      </div>
    );
  }
}

//maybe you need a switch case here so you can pass down the username?
//Login directs you to either sign up or to app.jsx
