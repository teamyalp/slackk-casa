import React from 'react';
import { Button, Container, Row } from 'reactstrap';

export default class ImageUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            image: '' 
        };
    }

    //get user's profile image

    //change user's profile image

    render() {
        let { image } = this.state;
        return (
            <Container>
                <Row>
                    Profile Image
                </Row>
                <Row>
                    <Button color="secondary">Cancel</Button>
                    <Button color="success">Save</Button>
                </Row>
            </Container>
        )
    }
}