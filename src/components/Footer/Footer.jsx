import React, { Component } from "react";
import { Grid , Row, Col} from "react-bootstrap";

class Footer extends Component {
  render() {
    var color = {
      backgroundColor: "transparent",
      margin: 0,
      padding: 0,
    }
    return (
      <footer className="footer" style={color}>
        <Grid fluid>
        <Row>
          <Col sm={3} md={2}>
          <nav className={"pull-left"}>
            <ul>
              <li >
                <a href="/" style={{ color: "white" }}>Home</a>
              </li>
            </ul>
            </nav>
            </Col>
            <Col sm={9} md={10}>
            <nav className={"pull-right"}>
            <p style={{ color: "gray" }} className="copyright pull-right">
              &copy; {new Date().getFullYear()}{" "}
              <a href="https:utkarshmalik211.github.io">Utkarsh Malik</a>, made with
              ❤ for a better web
            </p>
            </nav>
            </Col>
          </Row>
        </Grid>
      </footer>
    );
  }
}

export default Footer;
