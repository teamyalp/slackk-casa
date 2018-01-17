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
    super(props);
    this.state = {
      fullname: '',
      status: '',
      about: ''
    }
  }
  
  //create profiles table in database (user_id(from users table), fullname, status, about...image?)

  //get user's current profile information from DB profiles table
    //update state

  // create onChange funcs for each field
    //each will update the current state (make sure that if the changes are not saved, the values will revert back to original)

  //create onSubmit func when Save btn is clicked 
    //alters information in DB profiles table


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