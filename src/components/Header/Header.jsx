import React, { Component } from "react";
import { Navbar } from "react-bootstrap";

import HeaderLinks from "./HeaderLinks.jsx";

import dashboardRoutes from "routes/dashboard.jsx";

class Header extends Component {
  constructor(props) {
    super(props);
    this.mobileSidebarToggle = this.mobileSidebarToggle.bind(this);
    this.state = {
      sidebarExists: false
    };
    this.headerLogout = this.headerLogout.bind(this);
  }
  headerLogout(val){
    console.log('Bbie!');
    this.props.cookies.set('email','');
    this.props.cookies.set('loggedIn',false)
    this.props.cookies.set('pname','');
    this.props.cookies.set('token','');
    // this.props.cookies.set('email','');
    this.props.loginStateChange(val);
  }
  mobileSidebarToggle(e) {
    if (this.state.sidebarExists === false) {
      this.setState({
        sidebarExists: true
      });
    }
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    var node = document.createElement("div");
    node.id = "bodyClick";
    node.onclick = function () {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  }
  getBrand() {
    var name;
    dashboardRoutes.map((prop, key) => {
      if (prop.collapse) {
        prop.views.map((prop, key) => {
          if (prop.path === this.props.location.pathname) {
            name = prop.name;
          }
          return null;
        });
      } else {
        if (prop.redirect) {
          if (prop.path === this.props.location.pathname) {
            name = prop.name;
          }
        } else {
          if (prop.path === this.props.location.pathname) {
            name = prop.name;
          }
        }
      }
      return null;
    });
    return name;
  }
  render() {
    var color = {
      backgroundColor: "transparent"
    }
    let element;
    const isLoggedIn = this.props.isLoggedIn;
    if (isLoggedIn) {
      element = (
        <Navbar fluid   style={color}>
          <Navbar.Header>
            <Navbar.Brand >
              <a href="/">{this.getBrand()}</a>
            </Navbar.Brand>
            <Navbar.Toggle onClick={this.mobileSidebarToggle} />
          </Navbar.Header>
          <Navbar.Collapse>
              <HeaderLinks isLoggedIn={isLoggedIn} loginStateChange={this.headerLogout} />
          </Navbar.Collapse>
        </Navbar>
      );
    }
    else if (!isLoggedIn) {
      element = (
        <Navbar style={color}  fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">{"HyperTune"}</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Navbar.Collapse>
            <HeaderLinks isLoggedIn={isLoggedIn} loginStateChange={this.headerLogout} />
          </Navbar.Collapse>
        </Navbar>
      );
    }
    return element;
  }
}

export default Header;
