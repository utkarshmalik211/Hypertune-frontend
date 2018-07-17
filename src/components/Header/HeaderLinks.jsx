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
            <i className="fa fa-dashboard" />
            <p className="hidden-lg hidden-md">Dashboard</p>
          </NavItem>
          {/* <NavItem eventKey={3} href="#">
          <i className="fa fa-search" />
          <p className="hidden-lg hidden-md">Search</p>
        </NavItem> */}
        </Nav>
        <Nav pullRight>
          <NavItem eventKey={1} href="#">
            Account
        </NavItem>
          {/* <NavDropdown
          eventKey={2}
          title="Dropdown"
          id="basic-nav-dropdown-right"
        >
          <MenuItem eventKey={2.1}>Action</MenuItem>
          <MenuItem eventKey={2.2}>Another action</MenuItem>
          <MenuItem eventKey={2.3}>Something</MenuItem>
          <MenuItem eventKey={2.4}>Another action</MenuItem>
          <MenuItem eventKey={2.5}>Something</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey={2.5}>Separated link</MenuItem>
        </NavDropdown> */}
       
          <NavItem eventKey={3} onClick={() => { this.props.loginStateChange(false)}}>
            Log out
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
