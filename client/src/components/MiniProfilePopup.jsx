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
    // this.getUserProfile();
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
    console.log(this.props)
    const styles = {
      // container: {
      //   width: '500px'
      // },
      // // popover: {
      // //   width: '500px'
      // // },
      // popoverImg: {
      //   float: 'left'
      // },
      // popoverInfo: {
      //   float: 'right',
      //   width: '200px'
      // },
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
        fontStyle: 'italic',
        color: '#444',
      },
      bio: {
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
              Status:
              <div style={styles.status}>{this.state.userProfile.status}</div>
              Bio:
              <div style={styles.bio}>{this.state.userProfile.bio}</div>
            </div>
          </PopoverBody>
        </Popover>
      </span>
    );
  }
}