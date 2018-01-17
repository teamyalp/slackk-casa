import React from 'react';
import { Link } from 'react-router-dom';
import ImageUpload from './ImageUpload.jsx';

import { 
    Button,
    Col,
    Container,
    Form,
    FormGroup,
    Label,
    Input,
    Navbar, 
    NavbarBrand,
    NavItem,
    Row
} from 'reactstrap';

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fullname: '',
            username: '',
            about: '',
            email: '',
            friends: [] 
        };
        this.fullnameOnChange = this.fullnameOnChange.bind(this);
    }

    componentWillMount() {
        //get user data
    }

    //get user data

    //onChange methods for each data input
        //Full Name
        //Username (?)
        //About/What You Do
        //Email
        //Friends (? discuss direct messages...)

    fullnameOnChange(e) {
        this.setState({
            fullname: e.target.value
        })
    }

    saveChanges() {

    }

    render() {
        return (
            <Container fluid className="profilePage">
                <Row>
                    <Col xs={{size: 8, offset: 3}}>
                        <Navbar expand="md">
                            <Button type="secondary">
                                <Link to="/messages">X</Link>
                            </Button>
                            <NavbarBrand>Profile Preferences</NavbarBrand>
                        </Navbar>
                    </Col>
                </Row>
                <Row>
                    <Col xs={{size: 6, offset: 3}}>
                        <Button className="float-right">Update Login Information</Button>
                    </Col>    
                </Row>
                <Row>
                    <Col xs={{size: 2, offset: 3}}>
                        <ImageUpload/>
                    </Col>
                    <Col xs={4}>
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
                                <Input type="select" id="statusSelect" placeholder="">
                                    <option>Away</option>
                                    <option>In a Meeting</option>
                                    <option>Working Remote</option>
                                    <option>Vacationing</option>
                                    <option>Out Sick</option>
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for="whatYouDo">What You Do</Label>
                                <Input type="text" id="whatYouDo" placeholder="replace this with the current user's info, if available" />
                            </FormGroup>
                            
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col xs={{size: 3, offset: 5}}>
                        <Button color="secondary">Cancel</Button>
                        <Button color="success">Save</Button>
                    </Col>
                </Row>
            </Container>
        )
    }
}