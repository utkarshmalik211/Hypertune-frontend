import React, { Component } from "react";
// import ChartistGraph from "react-chartist";
import { Grid, Row, Col } from "react-bootstrap";
import axios from 'axios';
import { TaskCard } from "components/Card/TaskCard.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { Tasks } from "components/Tasks/Tasks.jsx";
import NotificationSystem from "react-notification-system";
import {
  // dataSales,
  // optionsSales,
  // responsiveSales,
  // legendSales,
  // dataBar,
  // optionsBar,
  // responsiveBar,
  // legendBar,
  style
} from "variables/Variables.jsx";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.updateData = this.updateData.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.varChange = this.varChange.bind(this);
    this.state = {
      data: {
        "Select": "Project",
        "__Select": "U"
      },
    }
    this.cookie = this.props.cookies;
    this.socket = this.props.socket;
  }
  updateData() {
    try {
      axios.post("/api/getData", {
        pname: this.cookie.get('pname'),
        token: this.cookie.get('token')
      })
        .then(data => {
          const variables = {};
          // data = JSON.parse(data);
          // console.log(data);
          try {
            for (const i in data.data.data.variables) {
              if (data.data.data.variables[i]) {
                variables[i] = data.data.data.variables[i];
                // console.log(variables[i]);
              }
            }
            this.setState({ data: variables });
          } catch (e) {
            this.setState({
              data: {
                "No Data": "For " + this.cookie.get('pname'),
                "__No Data": "Undefined"
              }
            });
          }
        });
    } catch (e) {
      console.error(e);
      this.setState({ data: { "No": "Internet" } });
    }
  }
  componentDidMount() {
    try {
      this.socket.on('data', data => {
        this.setState({ data: JSON.parse(data.variables) });
      });
    } catch (e) {
      this.setState({ data: { "No": "Network" } });
    }
    this.setState({ projectDetails: this.props.project }, () => { this.updateData.bind(this) });
    this.updateData();
  }

  // componentWillUpdate(){
  //   this.updateData();
  // }
  componentWillReceiveProps(nextProps) {
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
    oldVars[varName] = value;
    // console.log(oldVars);
    this.varChange(oldVars);
    this.setState({ data: oldVars });

  }
  varChange(varArray) {
    try {
      // console.log(this.cookie.get('pname'),this.cookie.get('token'),varArray);
      axios.post("/api/addvardata", {
        pname: this.cookie.get('pname'),
        token: this.cookie.get('token'),
        variables: JSON.stringify(varArray),
        clientSet: true
      })
        .then(data => {
          return true;
        })
    } catch (e) {
      console.error(e);
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
              if (!key.startsWith('__')) {
                return (
                  <Col key={key} lg={3} sm={6}>
                    <StatsCard key={key}
                      bigIcon={<i key={key} className="text-success">{key.charAt(0).toUpperCase()}</i>}
                      statsText={key}
                      statsValue={this.state.data[key]}
                      statsIcon={<p key={key} className="fa">{this.state.data['__' + key].charAt(0).toUpperCase()}</p>}
                      statsIconText={"Data type:  " + this.state.data['__' + key]}
                      edit={true}
                      handleUpdate={this.handleUpdate}
                    />
                  </Col>
                )
              }
            }.bind(this))}
          </Row>
          <Row>
            <Col md={6}>
              <TaskCard
                title="Tasks"
                category={this.cookie.get('pname') + " development"}
                stats="Updated 3 minutes ago"
                statsIcon="pe-7s-helm"
                content={
                  <div className="table-full-width">
                    <table className="table">
                      <Tasks cookie={this.cookie} />
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
