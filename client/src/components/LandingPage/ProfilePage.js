import React, { Component } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import logo from "../../assets/img/logo_name.png";

export default class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetched: true,
      email: "example@email.com",
      github: "example",
      linkedin: "example",
    };
  }

  renderInfo() {
    return (
      <Form>
        <Form.Group as={Row} controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            Email
          </Form.Label>
          <Col sm="10">
            <Form.Control plaintext readOnly defaultValue={this.state.email} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            Github
          </Form.Label>
          <Col sm="10">
            <Form.Control plaintext readOnly defaultValue={this.state.github} />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            Linkedin
          </Form.Label>
          <Col sm="10">
            <Form.Control plaintext readOnly defaultValue={this.state.linkedin} />
          </Col>
        </Form.Group>
      </Form>
    );
  }

  render() {
    if (this.state.fetched) {
      return (
        <div className="background">
          <div className="signin-page-input-container">
            <div className="signin-page-logo">
              <Link to="/">
                <img src={logo} className="logo" alt="Logo" />
              </Link>
            </div>
            {this.renderInfo()}
          </div>
        </div>
      );
    } else {
      return;
    }
  }
}
