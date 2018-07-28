import React, { Component } from "react";
// import { Row, Col, Form, FormControl, Button } from "react-bootstrap";

export class TaskCard extends Component {
  constructor(props) {
    super(props);
    // this.handleUpdate = this.props.handleUpdate;
    // this.handleChange = this.handleChange.bind(this);
    this.state = {
      value: ''
    };
  }
  render() {
    
    return (
      <div className={"card" + (this.props.plain ? " card-plain" : "")}>
        <div className={"header" + (this.props.hCenter ? " text-center" : "")}>
          <h4 className="title">{this.props.title}</h4>
          <p className="category">{this.props.category}</p>
        </div>
        <div
          className={
            "content" +
            (this.props.ctAllIcons ? " all-icons" : "") +
            (this.props.ctTableFullWidth ? " table-full-width" : "") +
            (this.props.ctTableResponsive ? " table-responsive" : "") +
            (this.props.ctTableUpgrade ? " table-upgrade" : "")
          }
        >
          {this.props.content}
          {this.props.legend}
          {this.props.stats != null ? <hr /> : ""}

        </div>
      </div>
    );
  }
}

export default TaskCard;
