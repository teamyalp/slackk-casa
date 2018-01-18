import React from 'react';

import {
  Button,
  Container,
  Form, 
  FormGroup,
  FormText,
  Input,
  Label
} from 'reactstrap';

export default class LoginSettingsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.userProfile,
      username: this.props.username,
      // email: this.props.userProfile.email || '',
    };
  }

  //should users be allowed to change their username?? would need to check that username is not already taken

  //get user's current login information from DB users table (username, email, pw)
    //update state
  getUserLoginInfo() {
    // fetch('/userlogin', {
    //   method: 'GET',

    // })
  }
  // create onChange funcs for each field (username, email, pw)
    //each will update the current state (make sure that if the changes are not saved, the values will revert back to original)

  //create onSubmit func when Save btn is clicked 
    //alters information in DB users table

  render() {
    let { username, email } = this.state;
    const styles = {
      container: {
          padding: '20px'
      }
    }
    return (
      <Container style={styles.container}>
        <Form>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input
              type="text"
              id="username"
              placeholder={username}
            />
            <FormText color="muted">
              This is what other users will see and refer to you as in Slap.
            </FormText>
          </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input 
              type="email" 
              id="email" 
              placeholder={email} 
            />
          </FormGroup>
        </Form>
        <Button color="success">Save</Button>
      </Container>
    )
  }
}