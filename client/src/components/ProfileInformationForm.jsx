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
      user: this.props.user,
      username: this.props.username,
      fullname: this.props.user.fullname || 'Tell us your full name',
      status: this.props.user.status || '',
      bio: this.props.user.bio || 'Add a brief bio',
      phone: this.props.user.phone || 'Add a phone number',
      updateSuccess: false,
    }
    this.onSave = this.onSave.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  // create onChange funcs for each field
    //each will update the current state (make sure that if the changes are not saved, the values will revert back to original)
    //refactor to submit button & handling submit?? (e.preventDefault())
  onChange(event, input) {
    if (input === 'fullname') {
      this.setState({ fullname: event.target.value })
    }
    if (input === 'status') {
      this.setState({ status: event.target.value })
    }
    if (input === 'bio') {
      this.setState({ bio: event.target.value })
    }
    if (input === 'phone') {
      this.setState({ phone: event.target.value })
    }
  }

  //create onSubmit func when Save btn is clicked 
    //alters information in DB profiles table
  onSave() {
    let { username, fullname, status, bio, phone }=this.state;
    //POST to /profile, update information in database
    fetch('/profile', {
      method: 'POST',
      body: JSON.stringify({ username, fullname, status, bio, phone }),
      headers: { 'content-type': 'application/json' }
    })
    .then(resp => 
      (resp.status === 200
      ? this.setState({ updateSuccess: true })
      : undefined ))
    .catch(console.error);
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
            <Label for="fullname">Full Name</Label>
            <Input
              type="text"
              id="fullname"
              placeholder={this.props.user.fullname}
              onChange={(event) => this.onChange(event, 'fullname')}
            />
          </FormGroup>

          <FormGroup>
            <Label for="status">Status</Label>
            <Input type="select" id="status" value={this.props.user.status} onChange={(event) => this.onChange(event, 'status')}>
              <option value=""> </option>
              <option value="Away">Away</option>
              <option value="In a Meeting">In a Meeting</option>
              <option value="Working Remote">Working Remote</option>
              <option value="Vacationing">Vacationing</option>
              <option value="Out Sick">Out Sick</option>
            </Input>
            <FormText color="muted">
              Let others know what you're doing.
            </FormText>
          </FormGroup>

          <FormGroup>
            <Label for="bio">Bio</Label>
            <Input 
              type="text" 
              id="bio" 
              placeholder={this.props.user.bio} 
              onChange={(event) => this.onChange(event, 'bio')}
            />
            <FormText color="muted">
              Tell others a little about yourself.
            </FormText>
          </FormGroup>

          <FormGroup>
            <Label for="phone">Phone</Label>
            <Input 
              type="text" 
              id="phone" 
              placeholder={this.props.user.phone}
              onChange={(event) => this.onChange(event, 'phone')}
            />
          </FormGroup>
        </Form>
        <Button onClick={this.onSave} color="success">
          { this.state.updateSuccess ? 'Saved!' : 'Save' }
        </Button>
      </Container>
    )
  }
}