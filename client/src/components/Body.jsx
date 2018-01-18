import React from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem, Button } from 'reactstrap';
import MessageList from './MessageList.jsx';
import WorkSpaceList from './WorkSpaceList.jsx';
import PropTypes from 'prop-types';
import SearchResults from './SearchResults.jsx'
import MemberList from './MemberList.jsx';

//container for other containers
export default class Body extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.directMessage = this.directMessage.bind(this);
  }

  directMessage(username) {
    const { loadWorkSpaces, users } = this.props;
    let userId;
    for (var i = 0; i < users.length; i++) {
      if (users[i].username === username) {
        userId = users[i].id;
        break;
      }
    }
    if (userId) {
      fetch('/workspaces', {
        method: 'POST',
        body: JSON.stringify({ name: username, id: userId }),
        headers: { 'content-type': 'application/json' },
      })
        .then(resp => (resp.status === 201 ? loadWorkSpaces() : console.log('createWorkSpace failed')))
        .catch(console.error);
    }
  }

  render() {
    let {
      workSpaces,
      messages,
      filteredMessages,
      loadWorkSpaces,
      changeCurrentWorkSpace,
      currentWorkSpaceId,
      users,
      username,
    } = this.props;
    return (
      <Container fluid>
        <Row>
          <Col className="side-bar-col" xs="2">
            <WorkSpaceList
              workSpaces={workSpaces}
              loadWorkSpaces={loadWorkSpaces}
              changeCurrentWorkSpace={changeCurrentWorkSpace}
              currentWorkSpaceId={currentWorkSpaceId}
            />
            <MemberList
              directMessage={this.directMessage}
              users={users}
              username={username}
              changeCurrentWorkSpace={changeCurrentWorkSpace}
            />
          </Col>
          <Col className="message-list-col" xs="10">
          {!filteredMessages ? 
            <MessageList messages={messages} currentWorkSpaceId={currentWorkSpaceId} directMessage={this.directMessage}/> :
            <SearchResults messages={filteredMessages} />
          }
          </Col>
        </Row>
      </Container>
    );
  }
}

Body.propTypes = {
  messages: PropTypes.array,
  workspaces: PropTypes.array,
  currentWorkSpaceId: PropTypes.number,
}