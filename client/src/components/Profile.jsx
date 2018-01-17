import React from 'react';
import { Link } from 'react-router-dom';
import ImageUpload from './ImageUpload.jsx';
import classnames from 'classnames';

import { 
    Button,
    Col,
    Container,
    Form,
    FormGroup,
    FormText,
    Label,
    Input,
    Nav,
    Navbar, 
    NavbarBrand,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane
} from 'reactstrap';

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fullname: '',
            username: '',
            about: '',
            email: '',
            friends: [],
            activeTab: '1', 
        };
        this.fullnameOnChange = this.fullnameOnChange.bind(this);
        this.toggle = this.toggleTabs.bind(this);
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

    toggleTabs(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
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
                            <NavbarBrand>Settings</NavbarBrand>
                        </Navbar>
                    </Col>
                </Row>
                <Row>
                    <Col xs={{size: 2, offset: 3}}>
                        <ImageUpload/>
                    </Col>
                    <Col xs={4}>

                    <Nav tabs>
                        <NavItem>
                            <NavLink 
                            className={classnames({ active: this.state.activeTab === '1' })}
                            onClick={() => { this.toggleTabs('1') }}
                            >
                                Login Details
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink 
                            className={classnames({ active: this.state.activeTab === '2' })}
                            onClick={() => { this.toggleTabs('2') }}
                            >
                                Profile Information
                            </NavLink>
                        </NavItem>
                    </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <Form>
                                    <FormGroup>
                                        <Label for="username">Username</Label>
                                        <Input
                                            type="text"
                                            id="username"
                                            placeholder="replace this with the current username"
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="email">Email</Label>
                                        <Input type="email" id="email" placeholder="replace with user's email"/>
                                        <FormText color="muted">
                                            This is some placeholder block-level help text for the above input.
                                        </FormText>
                                    </FormGroup>
                                </Form>
                                <Button color="success">Save</Button>
                            </TabPane>
                        </TabContent>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="2">
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
                            </TabPane>
                        </TabContent>
                    </Col>
                </Row>
            </Container>
        )
    }
}