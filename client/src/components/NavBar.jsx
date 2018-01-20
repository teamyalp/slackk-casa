import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Search from './Search.jsx'

import {
  Collapse,
  inNavBar,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
  render() {
    const styles = {
      link: {
        textDecoration: 'none',
      },
      dropdown: {
        padding: '5px 0 0 32px'
      }
    };
    return (
      <Navbar color="faded" light expand="md">
        <NavbarBrand>
          <h1>Slap!</h1>
        </NavbarBrand>
        <h3 className="text-center">
          #{this.props.currentWorkSpaceName || 'select a workspace!'}{' '}
        </h3>
        {this.props.filteredMessages ? 
          <h4 style={{'paddingLeft': '30px'}}>Showing search results...</h4> :
          ''
        }
        <Search searchClick={this.props.searchClick} />
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle nav caret>
                Options
              </DropdownToggle>
              <DropdownMenu>
                <Link to={`/profile/${this.props.user.username}`} style={styles.link}>
                  <DropdownItem style={styles.dropdown}>Settings</DropdownItem>
                </Link>
                <NavLink href="/login">
                  <DropdownItem>Sign Out</DropdownItem>
                </NavLink>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

NavBar.propTypes = {
  currentWorksSpaceName: PropTypes.string,
}
NavBar.defaultProps = {
  currentWorkSpaceName: 'select a workspace!',
}