import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import NotificationSystem from "react-notification-system";
import Login from "views/Login/Login";
import Cookies from 'universal-cookie';
import Header from "components/Header/Header";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";
import imagine from "assets/img/back.jpg";

import { style } from "variables/Variables.jsx";

import dashboardRoutes from "routes/dashboard.jsx";
import io from 'socket.io-client/lib';
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleNotificationClick = this.handleNotificationClick.bind(this);
    this.loginStateChange = this.loginStateChange.bind(this);

    this.projectListUpdated = this.projectListUpdated.bind(this);
    // this.handleLogout = this.handleLogout.bind(this);
    this.cookies = new Cookies();
    try {
      this.socket = io('https://hypertune-backend.herokuapp.com', { 'transports': ['websocket'] });
      this.socket.on('confirm', () => {
        console.log('connected');
        if (this.cookies.get('email') && this.cookies.get('pname')) {

          console.log("RoomSelected:", this.cookies.get('pname') + "_" + this.cookies.get('email'))
          this.socket.emit('room', this.cookies.get('pname') + "_" + this.cookies.get('email'))
        }
      });
    } catch (e) {
      console.info("Network Down");
    }
    this.state = {
      _notificationSystem: null,
      isLoggedIn: false,
    };

  }
  projectListUpdated(project) {
    // console.log('This should update my children!');
    this.setState({ projects: project });
  }
  loginStateChange(val) {
    this.setState({ isLoggedIn: val });
  }
  handleNotificationClick(position) {
    var color = Math.floor(Math.random() * 4 + 1);
    var level;
    switch (color) {
      case 1:
        level = "success";
        break;
      case 2:
        level = "warning";
        break;
      case 3:
        level = "error";
        break;
      case 4:
        level = "info";
        break;
      default:
        break;
    }
    this.state._notificationSystem.addNotification({
      title: <span data-notify="icon" className="pe-7s-gift" />,
      message: (
        <div>
          Welcome to <b>HyperTune</b>
        </div>
      ),
      level: level,
      position: position,
      autoDismiss: 15
    });
  }
  componentDidMount() {
    this.socket.on('notify', data => {
      console.log(data);
      this.state._notificationSystem.addNotification({
        title: <span data-notify="icon" className="pe-7s-gift" />,
        message: (
          <div>
            HyperTune : {data}
          </div>
        ),
        level: "success",
        position: "tr",
        autoDismiss: 15
      });
    });
    var _notificationSystem = this.refs.notificationSystem;
    var color = Math.floor(Math.random() * 4 + 1);
    var level;
    switch (color) {
      case 1:
        level = "success";
        break;
      case 2:
        level = "warning";
        break;
      case 3:
        level = "error";
        break;
      case 4:
        level = "info";
        break;
      default:
        break;
    }
    _notificationSystem.addNotification({
      title: <span data-notify="icon" className="pe-7s-gift" />,
      message: (
        <div>
          Welcome to <b>HyperTune</b>
        </div>
      ),
      level: level,
      position: "tr",
      autoDismiss: 15
    });
    this.setState({ _notificationSystem: this.refs.notificationSystem });

  }
  componentDidUpdate(e) {
    if (
      window.innerWidth < 993 &&
      e.history.location.pathname !== e.location.pathname &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
    }
    if (e.history.action === "PUSH") {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      // this.refs.mainPanel.scrollTop = 0;
    }
  }

  // handleLogin() {
  //   this.setState({ isLoggedIn: true });
  // }

  // handleLogout() {
  //   this.setState({ isLoggedIn: false });
  // }

  render() {
    let element;
    const isLoggedIn = this.state.isLoggedIn;
    const color = {
      backgroundImage: "url(" + imagine + ")",
      /* Full height */
      height: "100%",
      minHeight: '100%',
      // /* Center and scale the image nicely */
      // backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover"
    };
    if (isLoggedIn === true) {
      element =
        <div className="wrapper" style={color}>
          <NotificationSystem ref="notificationSystem" style={style} />
          <Sidebar {...this.props} socket={this.socket} projectupdate={this.projectListUpdated} cookie={this.cookies} loginStateChange={this.loginStateChange} />
          <div id="main-panel" className="main-panel" ref="mainPanel" >
            <Header {...this.props} isLoggedIn={isLoggedIn} cookies={this.cookies} loginStateChange={this.loginStateChange} />
            <Switch>
              {dashboardRoutes.map((prop, key) => {
                if (prop.name === "Notifications")
                  return (
                    <Route
                      path={prop.path}
                      key={key}
                      render={routeProps => (
                        <prop.component
                          {...routeProps}
                          handleClick={this.handleNotificationClick}
                        />
                      )}
                    />
                  );
                if (prop.redirect)
                  return <Redirect from={prop.path} to={prop.to} key={key} />;
                return (
                  <Route path={prop.path} render={routeProps => (
                    <prop.component
                      {...routeProps}
                      handleClick={this.handleNotificationClick}
                      project={this.state.projects}
                      socket={this.socket}
                      cookies={this.cookies}
                    />)} key={key} />
                );
              })}
            </Switch>
            <Footer />
          </div>
        </div>
    } else if (isLoggedIn === false) {
      // this.handleLogin();
      element = <div className="wrapper">
        <NotificationSystem ref="notificationSystem" style={style} />
        <Header {...this.props} isLoggedIn={false} name="HyperTune" />
        <Switch>
          <Route path={'/'} render={routeProps => (
            <Login
              {...routeProps}
              loginStateChange={this.loginStateChange} cookies={this.cookies}
            />)} />
        </Switch>
        <Footer />
      </div>
    }
    return element
  }
}

export default Dashboard;
