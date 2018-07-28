import React, { Component } from "react";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { FormControl } from "react-bootstrap";
import Checkbox from "components/CustomCheckbox/CustomCheckbox.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import axios from 'axios';
export class Tasks extends Component {
  constructor(props) {
    super(props);
    this.updateData = this.updateData.bind(this);
    this.addTasks = this.addTasks.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.handleTick = this.handleTick.bind(this);
    this.state = {
      value: '',
      tasks: {"Loading":true}
    }
  }
  handleChange = event => {
    // event.preventDefault();
    this.setState({ value: event.target.value });
  }
  handleTick(val) {
    try {
      this.state.tasks[val] = !this.state.tasks[val];
      this.setState({ tasks: this.state.tasks });
      axios.post("/api/addTask", {
        pname: this.cookie.get('pname'),
        token: this.cookie.get('token'),
        email: this.cookie.get('email'),
        tasks: JSON.stringify(this.state.tasks)
      })
        .then(data => {
          try {
            // console.log(data.data);
          } catch (e) {
            // this.setState({ tasks:  ["No Data For " + this.cookie.get('pname') ] });
            console.log("error ticking");
          }
        });
    } catch (e) {
      console.error(e);
      // this.setState({ data: { "No": "Internet" } });
    }
  }
  deleteTask(val) {
    try {
      // console.log(val);
      delete this.state.tasks[val];
      this.setState({ tasks: this.state.tasks });
      axios.post("/api/addTask", {
        pname: this.cookie.get('pname'),
        token: this.cookie.get('token'),
        email: this.cookie.get('email'),
        tasks: JSON.stringify(this.state.tasks)
      })
        .then(data => {
          try {
            // console.log(data.data);
          } catch (e) {
            // this.setState({ tasks:  ["No Data For " + this.cookie.get('pname') ] });
            console.log("error deleting");
          }
        });
    } catch (e) {
      console.error(e);
      // this.setState({ data: { "No": "Internet" } });
    }
  }
  componentDidMount() {
    this.cookie = this.props.cookie;
    this.updateData();

  }
  handleCheckbox = event => {
    const target = event.target;
    // console.log(event.target);
    this.setState({
      [target.name]: target.checked
    });
  };
  addTasks() {
    try {
      if (this.state.value !== '') {
        if(this.state.tasks["No Data"] === false){
          delete this.state.tasks["No Data"];
        }
        // this.state.tasks.push(this.state.value);
        this.state.tasks[this.state.value] = false;
        this.setState({ tasks: this.state.tasks });
        axios.post("/api/addTask", {
          pname: this.cookie.get('pname'),
          token: this.cookie.get('token'),
          email: this.cookie.get('email'),
          tasks: JSON.stringify(this.state.tasks),
        })
          .then(data => {
            try {
              // console.log(data.data);
            } catch (e) {
              // this.setState({ tasks:  ["No Data For " + this.cookie.get('pname') ] });
              console.log("error adding");
            }
          });
      }
    } catch (e) {
      console.error(e);
      // this.setState({ data: { "No": "Internet" } });
    }
  }
  updateData() {
    try {
    axios.post("/api/getTasks", {
      pname: this.cookie.get('pname'),
      // token: this.cookie.get('token'),
      email: this.cookie.get('email')
    })
      .then(data => {
        if (data.data === 'no tasks') {
          this.setState({ tasks: {"No Data":false} });
        }
        else {
          this.setState({ tasks: data.data });
        }
      });
    } catch (e) {
      console.error(e);
      this.setState({ data: { "No": "Internet" } });
    }
  }
  render() {
    // const edit = <Tooltip id="edit_tooltip">Edit Task</Tooltip>;
    const remove = <Tooltip id="remove_tooltip">Remove</Tooltip>;
    const InputForm = ({ stateVal, changeFunc }) => <FormControl
      type="text"
      placeholder="Add New Task"
      value={stateVal}
      onChange={changeFunc}
    />;
    var tasks = [];
    var number;
    for (const i in this.state.tasks) {
      number = "checkbox" + i;

      tasks.push(
        <tr key={i}>
          <td>
            <Checkbox
              number={number}
              isChecked={this.state.tasks[i]}
              onClick={() => this.handleTick(i)}
            />
          </td>
          <td>{i}</td>
          <td className="td-actions text-right">
            <OverlayTrigger placement="top" overlay={remove}>
              <Button bsStyle="danger" simple type="button" bsSize="xs" onClick={() => this.deleteTask(i)}>
                <i className="fa fa-times" />
              </Button>
            </OverlayTrigger>
          </td>
        </tr>
      );
    }
    tasks.push(
      <tr key={1000}>
        <td colSpan={2}>
          {InputForm({ stateVal: this.state.value, changeFunc: this.handleChange })}
        </td>
        <td>
          <Button block className="pull-right" bsStyle="success" type="button" onClick={() => this.addTasks()}>Add</Button>
        </td>
      </tr>);
    return <tbody>{tasks}</tbody>;
  }
}

export default Tasks;
