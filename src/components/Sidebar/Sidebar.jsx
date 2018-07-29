import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Nav, Button } from 'react-bootstrap';
import imagine from "assets/img/back.jpg";
import logo from "assets/img/ht192.png";
import dashboardRoutes from "routes/dashboard.jsx";
import ProjectModal from 'components/ProjectModal/Modal';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
    this.state = {
      width: window.innerWidth,
    };
    this.socket = this.props.socket;
    this.cookie = this.props.cookie;
  }
  handleLogout(val) {
    console.log('Bbie!');
    this.cookie.set('email', '');
    this.cookie.set('loggedIn', false)
    this.cookie.set('pname', '');
    this.cookie.set('token', '');
    // this.props.cookies.set('email','');
    this.props.loginStateChange(val);
  }
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }
  updateDimensions() {
    this.setState({ width: window.innerWidth });
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }
  render() {
    const sidebarBackground = {
      backgroundImage: "url(" + imagine + ")"
    };
    return (
      <div
        id="sidebar"
        className="sidebar"
        data-color="black"
        data-image={imagine}
      >
        <div className="sidebar-background" style={sidebarBackground} />
        <div className="logo">
          <a
            href="/"
            className="simple-text logo-mini"
          >
            <div className="logo-img">
              <img src={logo} alt="logo_image" />
            </div>
          </a>
          <a
            href="/"
            className="simple-text logo-normal"
          >
            HyperTune
          </a>
        </div>
        <div className="sidebar-wrapper">
          <ul className="nav">
            {dashboardRoutes.map((prop, key) => {
              if (!prop.redirect)
                return (
                  <li
                    className={
                      prop.upgrade
                        ? "active active-pro"
                        : this.activeRoute(prop.path)
                    }
                    key={key}
                  >
                    <NavLink
                      to={prop.path}
                      className="nav-link"
                      activeClassName="active"
                    >
                      <i className={prop.icon} />
                      <p>{prop.name}</p>
                    </NavLink>
                  </li>
                );
              return null;
            })}
            <li>
              <Nav>
                <ProjectModal socket={this.socket} projectsUpdated={this.props.projectupdate} cookie={this.cookie} />
              </Nav>
            </li>
            {this.state.width <= 991 ? <li className={"active active-pro"}>
              <Nav>
                <center>
                  <Button  bsSize="large" bsStyle="warning" onClick={()=>this.handleLogout(false)} active>
                    Logout
                  </Button>
                </center>
              </Nav>
            </li> : null}
            
          </ul>
        </div>
      </div>
    );
  }
}

export default Sidebar;
