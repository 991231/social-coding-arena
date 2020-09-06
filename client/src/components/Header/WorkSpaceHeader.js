import React, { Component } from "react";
import { Navbar, NavDropdown, Nav } from "react-bootstrap";

export default class WorkSpaceHeader extends Component {
  render() {
    return (
      <div>
        <Navbar
          collapseOnSelect
          expand="lg"
          className="ace-dracula"
          variant="dark"
        >
          <Navbar.Brand href="#">Coding Arena</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <NavDropdown
                title="Questions"
                id="collasible-nav-dropdown"
                onSelect={(key, e) => this.props.handleQuestionChange(e)}
              >
                {this.props.problemTitles.map((value, index) => {
                  return (
                    <NavDropdown.Item eventKey={index}>
                      {value}
                    </NavDropdown.Item>
                  );
                })}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}
