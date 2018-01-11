import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Alert, FormGroup, Input, Button } from 'reactstrap';

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      signupSuccess: false,
      signupStatus: '',
    };
  }

  signUp() {
    if (username === '') {
      return this.setState({ signupStatus: 'Enter a username' });
    }
    let { username, password } = this.state;
    fetch('/signup', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'content-type': 'application/json' },
    })
      .then(resp =>
        (resp.status === 200
          ? this.setState({ signupSuccess: true })
          : this.setState({ signupStatus: `${resp.status} - ${resp.statusText}` })))
      .catch(console.error);
  }

  handleOnChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleKeyPress(event) {
    return event.key === 'Enter' ? this.signUp() : undefined;
  }

  render() {
    const styles = {
      body: {
        paddingTop: '40px',
        paddingBottom: '40px',
        maxWidth: '330px',
        padding: '15px',
        margin: '0 auto',
        textAlign: 'center',
      },
    };

    return (
      <div style={styles.body}>
        {this.state.signupSuccess ? (
          <Redirect
            to={{
              pathname: '/login',
            }}
          />
        ) : (
          <div>
            <Link style={{ textDecoration: 'none' }} to="/">
              <h1>slackk-casa</h1>
            </Link>
            <br />
            {this.state.signupStatus ? (
              <Alert color="danger">{this.state.signupStatus}</Alert>
            ) : (
              undefined
            )}
            <h2>Sign up</h2>
            <br />
            <FormGroup>
              <Input
                type="text"
                placeholder="Username"
                name="username"
                onChange={e => this.handleOnChange(e)}
                onKeyPress={e => this.handleKeyPress(e)}
                size="lg"
              />
              <Input
                type="password"
                placeholder="Password"
                name="password"
                onChange={e => this.handleOnChange(e)}
                onKeyPress={e => this.handleKeyPress(e)}
                size="lg"
              />
            </FormGroup>
            <Button onClick={() => this.signUp()} color="primary" size="lg" block>
              Sign up
            </Button>
          </div>
        )}
      </div>
    );
  }
}
