import React, { Component } from "react";
import { Row, Col, FormControl, Button } from "react-bootstrap";

export class StatsCard extends Component {
  constructor(props) {
    super(props);
    this.handleUpdate = this.props.handleUpdate;
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value: ''
    };
  }
  handleChange(e) {
    this.setState({ value: e.target.value });
  }
  render() {
    const Edit = () => {
      if (this.props.edit === true) {
        return (
          <Row>
            <Col xs={8}>
              <FormControl
                type="text"
                placeholder="New Value"
                value={this.state.value}
                onChange={this.handleChange}
              />
            </Col>
            <Col xs={4}>
              <Button block className="pull-right" bsStyle="warning" onClick={() => { this.handleUpdate(this.props.statsText, this.state.value) }}>Set</Button>
            </Col>
          </Row>
        )
      } else {
        return null;
      }
    };
    return (
      <div className="card card-stats">
        <div className="content">
          <Row>
            <Col xs={5}>
              <div className="icon-big text-center icon-warning">
                {this.props.bigIcon}
              </div>
            </Col>
            <Col xs={7}>
              <div className="numbers">
                <p>{this.props.statsText}</p>
                {this.props.statsValue}
              </div>
            </Col>
          </Row>
          <Edit />
          <div className="footer">
            <hr />
            <div className="stats">
              {this.props.statsIcon} {this.props.statsIconText}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StatsCard;
