import React from 'react';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';

export default class CreateWorkSpace extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      popoverOpen: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.closePopUp = this.closePopUp.bind(this);
  }

  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen,
    });
  }

  handleClick() {
    this.props.createWorkSpace();
    this.closePopUp();
  }

  handleChange(event) {
    this.props.getWorkSpaceQuery(event.target.value);
  }

  closePopUp() {
    this.setState({
      popoverOpen: false,
    });
  }

  render() {
    return (
      <div>
        <Button id="Popover1" onClick={this.toggle}>
          +
        </Button>
        <Popover
          placement="bottom"
          isOpen={this.state.popoverOpen}
          target="Popover1"
          toggle={this.toggle}
        >
          <PopoverHeader>Enter Workspace name: </PopoverHeader>
          <PopoverBody>
            <input type="text" placeholder="workspace name.." onChange={this.handleChange} />
            <button onClick={this.handleClick}> Add </button>
          </PopoverBody>
        </Popover>
      </div>
    );
  }
}
