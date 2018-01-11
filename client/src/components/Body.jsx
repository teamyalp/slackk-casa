import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import MessageList from './MessageList.jsx';

export default class Body extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container fluid>
      <Row>
        <Col className="side-bar-col" xs="2">
          SIDE BAR
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          Channels
          <br />
          <br />
          <br />
          <br />
          <br />
          DMS
        </Col>
        <Col className="message-list-col" xs="10">
            <MessageList messages={this.props.messages} />
        </Col>
      </Row>
      </Container>

    );
  }
}
