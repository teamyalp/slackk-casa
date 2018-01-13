import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import WorkSpaceEntry from './WorkSpaceEntry.jsx';
import CreateWorkSpace from './CreateWorkSpace.jsx';

export default class WorkSpaceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workSpaceQuery: '',
      createFail: false,
      createStatus: 'Failed to create workspace',
    };

    this.handleFail = this.handleFail.bind(this);
    this.getWorkSpaceQuery = this.getWorkSpaceQuery.bind(this);
    this.createWorkSpace = this.createWorkSpace.bind(this);
  }

  getWorkSpaceQuery(query) {
    this.setState({ workSpaceQuery: query });
  }

  createWorkSpace() {
    let { loadWorkSpaces } = this.props;
    let { workSpaceQuery, createFail } = this.state;
    this.setState({ createFail: false });
    if (workSpaceQuery.length > 0) {
      fetch('/workspaces', {
        method: 'POST',
        body: JSON.stringify({ name: workSpaceQuery }),
        headers: { 'content-type': 'application/json' },
      })
        .then(resp => (resp.status === 201 ? loadWorkSpaces() : this.setState({ createFail: true })))
        .catch(console.error);
    }
  }

  handleFail() {
    this.setState({ createFail: false });
  }

  render() {
    let { changeCurrentWorkSpace } = this.props;
    let { createFail, createStatus, workSpaceQuery } = this.state;
    return (
      <div>
        <h3 className="workSpace-header"> Workspaces </h3>
        {this.props.workSpaces.map(workSpace => (
          <WorkSpaceEntry
            workSpace={workSpace}
            handleFail={this.handleFail}
            key={workSpace.id}
            changeCurrentWorkSpace={changeCurrentWorkSpace}
          />
        ))}
        <CreateWorkSpace
          getWorkSpaceQuery={this.getWorkSpaceQuery}
          createWorkSpace={this.createWorkSpace}
        />
        <br />
        <br />
        {createFail ? <Alert color="danger"> {createStatus} </Alert> : undefined}
      </div>
    );
  }
}
