import React from 'react';
// const config = require('../../../config.js');

import { Button, 
  Container, 
  Form, 
  FormGroup,
  FormText, 
  Input, 
  Label, 
  Row 
} from 'reactstrap';

export default class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      imageFile: '', //uploaded file from user
      imageUrl: '', //link received from Imgur api / db
      imagePreview: '/../images/twitter-egg.png', 
      uploadSuccess: false,
      save: false,
      uploadStatus: '', 
    };
    this.onChange = this.onChange.bind(this);
    this.getImgurUrl = this.getImgurUrl.bind(this);
    this.updateProfileImage = this.updateProfileImage.bind(this);
  }

  componentWillMount() {
    this.getUserProfileImage();
  }

  //GET request to server/db from profiles table using username
  getUserProfileImage() {
    let { username } = this.props
    fetch(`/profile/${username}`, {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    })
      .then(resp => { return resp.json() })
      .then(data => {
        this.setState({
          imagePreview: data.image || '/../images / twitter - egg.png' //url saved in db if exists, else default
        })
      })
      .catch(console.error);
  }

  onChange(event) {
    event.preventDefault();
    // preview image
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.onloadend = () => {
      this.setState({
        imageFile: file,
        imagePreview: reader.result,
        uploadSucess: false,
        save: true
      });
    }
    reader.readAsDataURL(file);
  }

  //change user's profile image
  getImgurUrl() {
    let data = this.state.imagePreview.split(',');
    let image = data[1];
    //POST request to Imgur API with image to receive image URL
    fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      body: image,
      headers: {
        // 'Authorization': `Bearer ${config.accessToken}`,
        'Authorization': `Client-ID ${config.clientId}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    //get returned URL (data.link) and set imageUrl state to returned URL
    .then( resp => { return resp.json() } )
    .then( data => { 
      let imageUrl = data.data.link;
      this.updateProfileImage(imageUrl);
    })
    .catch( console.error );
  }
  
  //store image url in db profiles.image for user
  updateProfileImage(url) {
    fetch('/profile/image', {
      method: 'POST',
      body: JSON.stringify({ username: this.props.username, imageUrl: url }),
      headers: { 'content-type': 'application/json' }
    })
    .then(resp =>
      (resp.status === 200
        ? this.setState({ uploadSuccess: true, save: false } )
        : this.setState({ uploadStatus: `${resp.status} - ${resp.statusText}` })))
    .catch(console.error);
  }  

  //TODO: when rendering messages, pull image from db rather than default egg image, same with user/display name

  render() {
    let { image, imageUrl, imagePreview, uploadSuccess, save } = this.state;
    const styles = {
      egg: {
        backgroundColor: '#ddd',
        display: 'block',
        width: '100%',
        margin: '8px 0 10px 0',
      },
      label: {
        padding: '5px 0 0 0 '
      }
    }
    return (
      <Container>
        <Row>
          <Form id="imageForm">
            <FormGroup>
              <Label for="profileImage" style={styles.label}>Profile Image</Label>
              <img
                className="egg img-responsive"
                alt="profile-pic"
                src={imagePreview}
                style={styles.egg}
              />
              <Input type="file" name="profileImage" id="profileImage" onChange={(event) => this.onChange(event)} />
              <FormText color="muted">
                This is some placeholder block-level help text for the above input.
              </FormText>
            </FormGroup>
          </Form>
        </Row>
        <Row>
          <Button color="success" onClick={this.getImgurUrl} disabled={!save}>{ uploadSuccess ? 'Saved!': 'Save' }</Button>
        </Row>
      </Container>
    )
  }
}