import React, { Component } from "react";
import { Row, Col, Form, FormControl, Button } from "react-bootstrap";

export class StatsCard extends Component {
  constructor(props) {
    super(props);
    this.handleUpdate = this.props.handleUpdate;
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value: ''
    };
  }
  handleChange = event => {
    // event.preventDefault();
    this.setState({ value: event.target.value });
  }
  handleSubmit = event => {
    event.preventDefault();
    this.handleUpdate(this.props.statsText, this.state.value);
  }
  render() {
    const InputForm = ({stateVal,changeFunc}) => <FormControl
      type="text"
      placeholder="New Value"
      value={stateVal}
      onChange={changeFunc}
    />;
    // const Edit = () => {
    //   if (this.props.edit === true) {
    //     return (
    //       <Form onSubmit={this.handleSubmit}>
    //         <Row>
    //           <Col xs={8}>
    //           {InputForm({stateVal: this.state.value,changeFunc: this.handleChange})}
    //           </Col>
    //           <Col xs={4}>
    //             <Button block className="pull-right" bsStyle="warning" type="submit">Set</Button>
    //           </Col>
    //         </Row>
    //       </Form>
    //     )
    //   } else {
    //     return null;
    //   }
    // };
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
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col xs={8}>
              {InputForm({stateVal: this.state.value,changeFunc: this.handleChange})}
              </Col>
              <Col xs={4}>
                <Button block className="pull-right" bsStyle="warning" type="submit">Set</Button>
              </Col>
            </Row>
          </Form>
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
