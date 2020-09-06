import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";

export default class Header extends Component {
  render() {
    return (
      <>
        <Navbar>
          <Nav className="mr-auto">
            <Link to="/">
              <Navbar.Brand>Competitive Coding</Navbar.Brand>
            </Link>
          </Nav>

          <Button variant="outline-primary">Sign in</Button>
        </Navbar>
      </>
    );
  }
}
