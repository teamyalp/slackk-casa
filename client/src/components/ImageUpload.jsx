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
            username: this.props.username,
            imageSrc: "/../images/twitter-egg.png" 
        };
    }

    //create profileImages table in db or add images field to profiles table

    //get user's profile image from db (profiles or images table?) and update state (if null, default to egg image)

    //change user's profile image

    //TODO: when rendering messages, pull image from db rather than default egg image, same with user/display name

    render() {
        let { imageSrc } = this.state;
        const styles = {
            egg: {
                backgroundColor: 'lightblue',
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
                                src={imageSrc}
                                style={styles.egg}
                            />

                            <Input type="file" name="file" id="profileImage" />
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