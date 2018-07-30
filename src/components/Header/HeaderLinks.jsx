import React, { Component } from "react";
import { NavItem, Nav } from "react-bootstrap";

class HeaderLinks extends Component {

  render() {
    const isLoggedIn = this.props.isLoggedIn;
    let element;
    if (isLoggedIn) {
      element = <div>
        <Nav>
          <NavItem eventKey={1} href="/dashboard">
            <i style={{color: "white"}} className="fa fa-dashboard" />
            <p className="hidden-lg hidden-md">Dashboard</p>
          </NavItem>
        </Nav>
        <Nav pullRight>
          {/* <NavItem eventKey={1} href="#">
            Account
        </NavItem> */}
          <NavItem eventKey={3} onClick={() => { this.props.loginStateChange(false) }}>
            <p style={{color: "white"}}>Log out</p>
          </NavItem>
        </Nav>
      </div>
    } else {
      element = null;
    }
    return (element);
  }
}

export default HeaderLinks;
