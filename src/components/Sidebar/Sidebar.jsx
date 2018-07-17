import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import HeaderLinks from "../Header/HeaderLinks.jsx";
import { Nav } from 'react-bootstrap';
import imagine from "assets/img/sidebar-5.jpg";
import logo from "assets/img/ht512.png";
import dashboardRoutes from "routes/dashboard.jsx";
import ProjectModal from 'components/ProjectModal/Modal';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
    };
    this.socket = this.props.socket;
    this.cookie = this.props.cookie;
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
            {this.state.width <= 991 ? <HeaderLinks /> : null}
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
                <ProjectModal socket={this.socket} projectsUpdated={this.props.projectupdate} cookie={this.cookie}/>
              </Nav>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Sidebar;
