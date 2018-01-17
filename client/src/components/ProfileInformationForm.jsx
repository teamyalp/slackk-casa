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

export default class ProfileInformationForm extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const styles = {
      container: {
        padding: '20px'
      }
    }
    return(
      <Container style={styles.container}>
        <Form>
          <FormGroup>
            <Label for="fullName">Full Name</Label>
            <Input
              type="text"
              id="fullName"
              placeholder="replace this with the current user's fullname"
              onChange={this.fullnameOnChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="statusSelect">Status</Label>
            <Input type="select" id="statusSelect" placeholder="none">
              <option> </option>
              <option>Away</option>
              <option>In a Meeting</option>
              <option>Working Remote</option>
              <option>Vacationing</option>
              <option>Out Sick</option>
            </Input>
            <FormText color="muted">
              This is some placeholder block-level help text for the above input.
            </FormText>
          </FormGroup>
          <FormGroup>
            <Label for="whatYouDo">What You Do</Label>
            <Input type="text" id="whatYouDo" placeholder="replace this with the current user's info, if available" />
          </FormGroup>
        </Form>
        <Button color="success">Save</Button>
      </Container>
    )
  }
}