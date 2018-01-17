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
            imageSrc: "/../images/twitter-egg.png" 
        };
    }

    //get user's profile image

    //change user's profile image

    render() {
        let { imageSrc } = this.state;
        const styles = {
            egg: {
                backgroundColor: 'lightblue',
                display: 'block',
                width: '100%',
                margin: '0 0 10px 0',
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
                    <Button color="secondary">Cancel</Button>
                    <Button color="success">Save</Button>
                </Row>
            </Container>
        )
    }
}