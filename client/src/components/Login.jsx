import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Alert, Container, FormGroup, Input, Button } from 'reactstrap';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loginSuccess: false,
      loginStatus: '',
    };
  }

  logIn() {
    let { username, password } = this.state;
    fetch('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'content-type': 'application/json' },
    })
      .then(resp =>
        (resp.status === 201
          ? this.setState({ loginSuccess: true })
          : this.setState({ loginStatus: `${resp.status} - ${resp.statusText}` })))
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
        height: '100%',
        maxWidth: '330px',
        padding: '15px',
        margin: '0 auto',
        textAlign: 'center',
      },
    };

    return (
      <div style={styles.body}>
        {this.state.loginSuccess ? (
          <Redirect
            to={{
              pathname: '/messages',
              state: { username: this.state.username, password: this.state.password },
            }}
          />
        ) : (
          <Container>
            <Link style={{ textDecoration: 'none' }} to="/">
              <h1>slackk-casa</h1>
            </Link>
            <br />
            {this.state.loginStatus ? (
              <Alert color="danger">{this.state.loginStatus}</Alert>
            ) : (
              undefined
            )}
            <h2>Please log in</h2>
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
            <Button onClick={() => this.logIn()} color="primary" size="lg" block>
              Log in
            </Button>
          </Container>
        )}
      </div>
    );
  }
}
