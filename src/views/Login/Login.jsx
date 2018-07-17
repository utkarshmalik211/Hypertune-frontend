import React, { Component } from "react";
import { Form, FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import "./Login.css";
import Button from "components/CustomButton/CustomButton";
import { Card } from "components/Card/Card.jsx";
import $ from 'jquery';


class Login extends Component {
  constructor(props) {
    super(props);
    this.cookies = this.props.cookies;
    this.state = {
      email: "",
      password: ""
    };
    const isLoggedIn = this.cookies.get('loggedIn');
    if (isLoggedIn === 'true') {
      this.props.loginStateChange(true);
    }
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  register() {
    console.log('register pressed');
    $.ajax({
      url: "https://hypertune-backend.herokuapp.com:40520/user",
      type: 'post',
      data: {
        email: this.state.email,
        password: this.state.password
      },
      headers: {
        'Access-Control-Allow-Headers': ' x-requested-with x-requested-by'
      },
      dataType: 'text',
      success: function (data) {
        try {
          data = JSON.parse(data);
          console.log(data);
          if (data.email) {
            window.sessionStorage.setItem("email", data.email);
            this.cookies.set('email', data.email, { path: '/'});
            this.cookies.set('loggedIn', true, { path: '/'});
            this.props.loginStateChange(true);
          } else {
            console.log("User Already exists !")
          }
        } catch (e) {
          console.error("Error Registering in check Connection!");
        }
      }.bind(this),
    });
  }
  handleSubmit = event => {
    event.preventDefault();
    window.sessionStorage.setItem("isLoggedIn", true);

    $.ajax({
      url: "https://hypertune-backend.herokuapp.com:40520/login",
      type: 'post',
      data: {
        email: this.state.email,
        password: this.state.password
      },
      headers: {
        'Access-Control-Allow-Headers': ' x-requested-with x-requested-by'
      },
      dataType: 'text',
      success: function (data) {
        try {
          data = JSON.parse(data);
          if (data.user) {
            this.cookies.set('email', data.user.email, { path: '/'});
            this.cookies.set('loggedIn', true, { path: '/'});

            window.sessionStorage.setItem("email", data.user.email);
            this.props.loginStateChange(true);
          } else {
            console.info("Bad email password combo");
          }
        } catch (e) {
          console.error("Error Logging in check Connection!");
        }
      }.bind(this),
    });
    // this.props.loginStateChange(true);
  }

  render() {
    return (<div className="Login">
      <div className="layer">
        <Form onSubmit={this.handleSubmit}>
          <Card
            content={
              <div>
                <FormGroup controlId="email" bsSize="large">
                  <ControlLabel>Email</ControlLabel>
                  <FormControl
                    autoFocus
                    type="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                  <ControlLabel>Password</ControlLabel>
                  <FormControl
                    value={this.state.password}
                    onChange={this.handleChange}
                    type="password"
                  />
                </FormGroup>
                  <Button
                  block
                    fill
                    bsSize="large"
                    bsStyle="success"
                    disabled={!this.validateForm()}
                    type="submit"
                  >
                    Login
                  </Button>
                  <Button
                  block
                    fill
                    bsSize="large"
                    bsStyle="warning"
                    disabled={!this.validateForm()}
                    onClick={() => { this.register() }}
                  >
                    Register
                  </Button>

              </div>
            }
          />
        </Form>
      </div>
    </div>);
  }
}

export default Login;
