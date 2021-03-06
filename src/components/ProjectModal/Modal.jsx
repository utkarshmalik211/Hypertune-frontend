import React, { Component } from "react";
import $ from 'jquery';
import NotificationSystem from "react-notification-system";
import { style } from "variables/Variables.jsx";
import { NavLink } from "react-router-dom";
import { Modal, Button, Table, Tooltip, OverlayTrigger, FormControl } from 'react-bootstrap';
class ProjectModal extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleNotificationClick = this.handleNotificationClick.bind(this);
    this.projectNameSelect = this.projectNameSelect.bind(this);
    this.cookie = this.props.cookie;
    // this.handler = this.props.handler.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.getProjects = this.getProjects.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.createProject = this.createProject.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.showNotification = this.showNotification.bind(this);
    this.socket = this.props.socket;
    this.state = {
      show: false,
      projects: [],
      _notificationSystem: null,
    };
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
  showNotification(color = 1, data) {
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
      title: <span data-notify="icon" className="pe-7s-wallet" />,
      message: (
        <div>
          {data}
        </div>
      ),
      level: level,
      position: "tr",
      autoDismiss: 15
    });
  }
  deleteProject(event, pname, token) {
    event.preventDefault();
    $.ajax({
      url: "/api/deleteProject",
      type: 'post',
      data: {
        token: token,
        pname: pname,
        email: this.cookie.get('email'),
      },
      dataType: 'json',
      success: function (data, textStatus, xhr) {
        console.log(xhr.status);
        if (xhr.status === 200) {
          this.showNotification(1, "Project " + pname + " deleted");
          this.getProjects();
        } else {
          console.error('No such project');
        }
      }.bind(this),
    });
  }
  getProjects() {
    $.ajax({
      url: "/api/findProjects",
      type: 'post',
      data: {
        email: this.cookie.get('email')
      },
      dataType: 'json',
      success: function (data, textStatus, xhr) {
        // console.log(typeof data);
        // data = JSON.parse(data);
        if (data === []) {
          this.showNotification(4, "User " + this.cookie.get('email') + " has no projects");
        } else {
          this.setState({ projects: data });
          // console.log(this.state.projects);
        }
      }.bind(this),
    });
  }
  createProject() {
    if (this.state.value !== undefined && this.state.value !== '') {
      const pname = this.state.value;
      $.ajax({
        url: "/api/createProject",
        type: 'post',
        data: {
          email: this.cookie.get('email'),
          pname: pname
        },
        dataType: 'json',
        success: function (data, textStatus, xhr) {
          console.log(xhr.status);
          if (xhr.status === 200) {
            this.showNotification(1, "Project " + data.pname + " added");
            this.getProjects();
          }
        }.bind(this),
      });
    } else {
      console.error('Cannot create project with no name!');
    }
  }
  componentDidMount() {
    this.setState({ _notificationSystem: this.refs.notificationSystem });
    this.getProjects();
  }
  projectNameSelect(token, pname) {
    // console.log(pname);
    if (this.socketRoom !== undefined) {
      this.socket.emit('leave-room', this.socketRoom);
      console.info("Socket Left", this.socketRoom);
    }
    this.cookie.set('pname', pname);
    this.cookie.set('token', token);
    this.socketRoom = pname + "_" + this.cookie.get("email");
    this.socket.emit('room', this.socketRoom);
    console.log(typeof this.props.projectsUpdated);
    this.props.projectsUpdated(this.state.projects);
    console.log("Socket Joined Room: ", this.socketRoom);
    this.handleClose();
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }
  handleChange(e) {
    // console.log(e.target.value);
    this.setState({ value: e.target.value });
  }
  render() {
    const tooltip = (token) => { return <Tooltip placement="top" id="modal-tooltip">{token}</Tooltip> };
    return (
      <li>
        <NavLink to={'#'} onClick={() => this.handleShow(true)}>
          <i className={"pe-7s-wallet"} onClick={() => this.handleShow(true)} />
          <p>{"Projects"}</p>
        </NavLink>
        <NotificationSystem ref="notificationSystem" style={style} />

        <Modal show={this.state.show} onHide={this.handleClose} animation autoFocus={true} enforceFocus={true} backdrop={'static'}>
          <Modal.Header closeButton>
            <Modal.Title><center>Project Selection</center></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Click on project to select it.</p>
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Token</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.projects.map((project) => {
                    return (<tr key={project.token} onClick={() => this.projectNameSelect(project.token, project.projectName)}>
                      <td key={1}><a>{project.projectName}</a></td>
                      <td key={2}>
                        <OverlayTrigger key={2.1} overlay={tooltip(project.token)}>
                          <a href="#tooltip" key={2.2}>Token</a>
                        </OverlayTrigger>
                      </td>
                      <td key={3}><Button key={3.1} bsSize="small" bsStyle="danger" onClick={(event) => this.deleteProject(event, project.projectName, project.token)}>
                        Delete
                        </Button></td>
                    </tr>
                    )
                  })
                }
                <tr>
                  <td><FormControl type="text" value={this.state.value} placeholder="Project Name" onChange={this.handleChange} /></td>
                  <td colSpan={2}><Button bsStyle="info" onClick={() => this.createProject()}>Create and Select</Button></td>
                </tr>
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button active bsStyle="warning" onClick={() => this.handleClose()}>Close</Button>
          </Modal.Footer>
        </Modal>
      </li>

    );
  }
}

export default ProjectModal;
