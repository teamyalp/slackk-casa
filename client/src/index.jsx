import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';

import App from './components/App.jsx';
import Home from './components/Home.jsx';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';

import { BrowserRouter as Router, Route } from 'react-router-dom';

//Renders the dom. Route path tells the dom which component to render on which request.
//Home is the page with signup and login
ReactDOM.render(<Router>
  <div>
    <Route exact path="/" component={Home} />
    <Route path="/signup" component={Signup}/>
    <Route path="/login" component={Login}/>
    <Route path="/messages" component={App}/>
  </div>
</Router>, document.getElementById('app'));
