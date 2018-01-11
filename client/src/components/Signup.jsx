import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="Signup">
        Username:
        <input type="text" />
        Password:
        <input type="text" />
        <button>Sign up!</button>
        <Link to="/Login"><button>Login!</button></Link>
      </div>
    );
  }
};

//sign up redirects u to login which then redirects you to app.jsx.
