import React from 'react';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';

export default class MiniProfilePopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popoverOpen: false,
      userProfile: {}
    };
    this.toggle = this.toggle.bind(this);
  }

  componentWillMount() {
    fetch(`/profile/${this.props.username}`, {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    })
    .then(resp => { return resp.json() })
    .then(data => {
      this.setState({
        userProfile: data
      })
    })
    .catch(console.error);
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  render() {
    const styles = {
      username: {
        fontSize: '24',
        fontWeight: 'bold',
        display: 'inline',
        paddingBottom: '5px',
      },
      image: {
        width: '250px'
      }, 
      status: {
        color: '#444',
      },
      bio: {
        fontStyle: 'italic'
      },
      close: {
        float: 'right',
        textDecoration: 'none'
      }
    }
    return (
      <span>
        <span id={'Popover'} style={styles.username} onClick={this.toggle}>{this.props.username}</span>
        <Popover placement="top" isOpen={this.state.popoverOpen} target={'Popover'} toggle={this.toggle}>
          <PopoverHeader>
            {this.props.username}
            <span onClick={this.toggle} style={styles.close}>X</span>
          </PopoverHeader>
          <PopoverBody>
            <div style={styles.popoverImg}>
              <img src={this.state.userProfile.image} style={styles.image} ></img>
            </div>
            <div style={styles.popoverInfo}>
              <span style={styles.status}> Status: {this.state.userProfile.status}</span>
              <div>Bio:</div>
              <div style={styles.bio}>{this.state.userProfile.bio}</div>
            </div>
          </PopoverBody>
        </Popover>
      </span>
    );
  }
}