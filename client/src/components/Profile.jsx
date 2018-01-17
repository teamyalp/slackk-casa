import React from 'react';
import { Link } from 'react-router-dom';
import ImageUpload from './ImageUpload.jsx';
import LoginSettingsForm from './LoginSettingsForm.jsx';
import ProfileInformationForm from './ProfileInformationForm.jsx';
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
                                <LoginSettingsForm />
                            </TabPane>
                        </TabContent>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="2">
                                <ProfileInformationForm />
                            </TabPane>
                        </TabContent>
                    </Col>
                </Row>
            </Container>
        )
    }
}