import React from 'react';

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
            image: '', //uploaded file from user
            imageUrl: this.props.image || '/../images/twitter-egg.png', //link received from Imgur api / db
            uploadSuccess: false,
            uploadStatus: '', 
        };
    }

    //TODO: create profileImages table in db or add images field to profiles table

    //change user's profile image
    updateProfileImage() {
        var formData = new FormData();
        formData.append('image', this.state.image);
        
        //POST request to server => Imgur API with image to receive image URL
        //get returned URL (data.link) and set imageUrl state to returned URL
        //(SERVER SIDE) store returned URL in profiles db table for that user
        fetch('/user/image', {
            method: 'POST',
            body: formData,
            headers: { 'content-type': 'multipart/form-data'}
        })
        .then(resp => 
            ( //console.log('SUCCESS SENDING IMAGE (CLIENT) - resp:', resp.link)
            resp.status === 200 
            ? this.setState({ uploadSuccess: true, imageUrl: resp.link })
            : this.setState({ uploadStatus: `${resp.status} - ${resp.statusText}`})))
            .catch(console.error);
            
    }

    //TODO: when rendering messages, pull image from db rather than default egg image, same with user/display name

    render() {
        let { imageUrl } = this.state;
        const styles = {
            egg: {
                backgroundColor: '#ddd',
                display: 'block',
                width: '100%',
                margin: '8px 0 10px 0',
            },
        }
        return (
            <Container>
                <Row>
                    <Form>
                        <FormGroup>
                            <Label for="profileImage">Profile Image</Label>
                            <img
                                className="egg img-responsive"
                                alt="profile-pic"
                                src={imageUrl}
                                style={styles.egg}
                            />
                            <Input type="file" name="profileImage" id="profileImage" />
                            <FormText color="muted">
                                This is some placeholder block-level help text for the above input.
                            </FormText>
                        </FormGroup>
                    </Form>
                </Row>
                <Row>
                    <Button color="success">Save</Button>
                </Row>
            </Container>
        )
    }
}