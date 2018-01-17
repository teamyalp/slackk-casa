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
    super(props)
  }

  render() {
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
              placeholder="replace this with the current username"
            />
          </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input type="email" id="email" placeholder="replace with user's email" />
            <FormText color="muted">
              This is some placeholder block-level help text for the above input.
            </FormText>
          </FormGroup>
        </Form>
        <Button color="success">Save</Button>
      </Container>
    )
  }
}