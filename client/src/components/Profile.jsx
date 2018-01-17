import React from 'react';
import { Link } from 'react-router-dom';
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
        this.state = {};
    }

    componentWillMount() {
        //get user data
    }

    //get user data

    render() {
        return (
            <Container fluid className="profilePage">
                <Row>
                    <Col xs={8}>
                        <Navbar expand="md">
                            <NavbarBrand>Preferences</NavbarBrand>
                            <NavItem>
                                <Link to="/messages">X</Link>
                            </NavItem>
                        </Navbar>
                    </Col>
                </Row>
                <Row>
                    <Col xs={2}>
                        Profile Image
                    </Col>
                    <Col xs={4}>
                        <Form col-6>
                            <FormGroup>
                                <Label for="fullName">Full Name</Label>
                                <Input type="text" id="fullName" placeholder="replace this with the current user's fullname" />
                            </FormGroup>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }
}