import React from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import MessageList from './MessageList.jsx';
import WorkSpaceList from './WorkSpaceList.jsx';
import PropTypes from 'prop-types';
import SearchResults from './SearchResults.jsx'

//container for other containers
export default class Body extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {
      workSpaces,
      messages,
      filteredMessages,
      loadWorkSpaces,
      changeCurrentWorkSpace,
      currentWorkSpaceId,
    } = this.props;
    console.log(filteredMessages)
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
          </Col>
          <Col className="message-list-col" xs="10">
          {!filteredMessages.length ? 
            <MessageList messages={messages} currentWorkSpaceId={currentWorkSpaceId} /> :
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