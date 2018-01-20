import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { getWorkSpaceMessagesFromServer, getWorkSpaceDMessagesFromServer } from '../socketHelpers/index.js';
import PropTypes from 'prop-types';

export default class WorkSpaceEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick(event) {
    let { handleFail, changeCurrentWorkSpace, workSpace } = this.props;
    handleFail();
    console.log('this is workspace ID', workSpace.id)
    console.log('this is workspace.name', workSpace.name)
    changeCurrentWorkSpace(workSpace.id, workSpace.name);
    getWorkSpaceMessagesFromServer(workSpace.id);
    getWorkSpaceDMessagesFromServer(workSpace.name);
  }

  render() {
    let { workSpace, currentWorkSpaceId } = this.props;
    return (
      <div className="workSpace-entry-container">
        {workSpace.id === currentWorkSpaceId ? (
          <h5
            className="workSpace-name highlight-workSpace"
            onClick={event => this.handleClick(event)}
          >
            {' '}
            # {workSpace.name}
          </h5>
        ) : (
          <h5 className="workSpace-name workSpace-hover" onClick={event => this.handleClick(event)}>
            {' '}
            # {workSpace.name}
          </h5>
        )}
      </div>
    );
  }
}

WorkSpaceEntry.propTypes = {
  currentWorkSpaceId: PropTypes.number,
}