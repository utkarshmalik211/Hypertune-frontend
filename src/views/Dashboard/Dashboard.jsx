import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col } from "react-bootstrap";
import $ from 'jquery';
import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { Tasks } from "components/Tasks/Tasks.jsx";
import NotificationSystem from "react-notification-system";

import {
  dataSales,
  optionsSales,
  responsiveSales,
  legendSales,
  dataBar,
  optionsBar,
  responsiveBar,
  legendBar,
  style
} from "variables/Variables.jsx";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.updateData = this.updateData.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.varChange = this.varChange.bind(this);
    this.state = {
      data: { "Select": "Project" },
    }
    this.cookie = this.props.cookies;
    this.socket = this.props.socket;
  }
  updateData() {
    try {
      $.ajax({
        url: "https://hypertune-backend.herokuapp.com/getData",
        type: 'post',
        data: {
          pname: this.cookie.get('pname'),
          token: this.cookie.get('token')
        },
        headers: {
          'Access-Control-Allow-Headers': ' x-requested-with'
        },
        dataType: 'jsonp',
        success: function (data) {
          const variables = {};
          data = JSON.parse(data);
          try {
            for (const i in data.data.variables) {
              if (data.data.variables[i]) {
                variables[i] = data.data.variables[i];
                console.log(variables[i]);
              }
            }
            this.setState({ data: variables });
          } catch (e) {
            this.setState({ data: { "No Data": "For " + this.cookie.get('pname') } });
          }
        }.bind(this),
      });
    } catch (e) {
      console.error(e);
      this.setState({ data: { "No": "Internet" } });
    }
  }
  componentDidMount() {
    try {
      this.socket.on('data', data => {
        console.log(data);
        this.setState({ data: JSON.parse(data.variables) });
      });
    } catch (e) {
      this.setState({ data: { "No": "Network" } });
    }
    this.updateData();
  }

  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }
  handleUpdate(varName, value) {
    const oldVars = this.state.data;
    console.log(varName, value);
    oldVars[varName] = value;
    if (this.varChange(oldVars)) {
      this.setState({ data: oldVars });
    } else {
      console.error("Error in transaction!");
    }
  }
  varChange(varArray) {
    try {
      $.ajax({
        url: "https://hypertune-backend.herokuapp.com/addvardata",
        type: 'post',
        data: {
          pname: this.cookie.get('pname'),
          token: this.cookie.get('token'),
          variables: varArray,
          clientSet: true
        },
        headers: {
          'Access-Control-Allow-Headers': ' x-requested-with'
        },
        dataType: 'jsonp',
        success: function (data, textStatus, xhr) {
          if (xhr.status === 200) {
            console.info(data.message);
            return true;
          }
          return false;
        },
      });
    } catch (e) {
      console.error (e);
      return false;
    }
  }
  render() {
    return (
      <div className="content">
        <NotificationSystem ref="notificationSystem" style={style} />
        <Grid fluid>
          <Row>
            {Object.keys(this.state.data).map(function (key, index) {
              return (
                <Col key={key} lg={3} sm={6}>
                  <StatsCard key={key}
                    bigIcon={<i key={key} className="pe-7s-wallet text-success" />}
                    statsText={key}
                    statsValue={this.state.data[key]}
                    statsIcon={<i key={key} className="fa fa-calendar-o" />}
                    statsIconText="Last day"
                    edit={true}
                    handleUpdate={this.handleUpdate}
                  />
                </Col>
              )
            }.bind(this))}
          </Row>
          <Row>
            <Col md={8}>
              <Card
                statsIcon="fa fa-history"
                id="chartHours"
                title="Users Behavior"
                category="24 Hours performance"
                stats="Updated 3 minutes ago"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={dataSales}
                      type="Line"
                      options={optionsSales}
                      responsiveOptions={responsiveSales}
                    />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendSales)}</div>
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Card
                id="chartActivity"
                title="2014 Sales"
                category="All products including Taxes"
                stats="Data information certified"
                statsIcon="fa fa-check"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={dataBar}
                      type="Bar"
                      options={optionsBar}
                      responsiveOptions={responsiveBar}
                    />
                  </div>
                }
                legend={
                  <div className="legend">{this.createLegend(legendBar)}</div>
                }
              />
            </Col>

            <Col md={6}>
              <Card
                title="Tasks"
                category="Backend development"
                stats="Updated 3 minutes ago"
                statsIcon="fa fa-history"
                content={
                  <div className="table-full-width">
                    <table className="table">
                      <Tasks />
                    </table>
                  </div>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;
