import React from 'react';
import classnames from 'classnames';

import { Link } from 'react-router-dom';
import ImageUpload from './ImageUpload.jsx';
import LoginSettingsForm from './LoginSettingsForm.jsx';
import ProfileInformationForm from './ProfileInformationForm.jsx';

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
      username: this.props.match.params.username,
      activeTab: '1', 
    };
    this.toggle = this.toggleTabs.bind(this);
  }

  toggleTabs(tab) {
    this.state.activeTab !== tab ? this.setState({ activeTab: tab }) : undefined
  }

  render() {
    let { username, userProfile, activeTab } = this.state;
    const styles = {
      brand: {
        margin: '0 0 0 10px',
      },
      exit: {
        margin: '0',
        width: '40px',
      }
    };
    return (
      <Container fluid className="profilePage">
        <Row>
          <Col xs={{size: 8, offset: 3}}>
            <Navbar expand="md">
              <Button color="secondary" className="exit" style={styles.exit}>
                <Link 
                  to={{ pathname: '/messages', state: { username: this.state.username } }}
                  style={{ color: '#fff' }}>X</Link>
              </Button>
              <NavbarBrand className="brand" style={styles.brand}>Settings</NavbarBrand>
            </Navbar>
          </Col>
        </Row>
        <Row>
          <Col xs={{size: 2, offset: 3}}>
            <ImageUpload username={username} />
          </Col>
          <Col xs={4}>
            <Nav tabs>
              <NavItem>
                <NavLink 
                className={classnames({ active: activeTab === '1' })}
                onClick={() => { this.toggleTabs('1') }}
                >
                  Profile Information
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink 
                className={classnames({ active: activeTab === '2' })}
                onClick={() => { this.toggleTabs('2') }}
                >
                  Login Details
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <ProfileInformationForm username={username} />
              </TabPane>
            </TabContent>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="2">
                <LoginSettingsForm username={username} />
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </Container>
    )
  }
}