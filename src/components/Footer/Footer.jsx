import React, { Component } from "react";
import { Grid } from "react-bootstrap";

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <Grid fluid>
          <nav className="pull-left">
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
            </ul>
          </nav>
          <p className="copyright pull-right">
            &copy; {new Date().getFullYear()}{" "}
            <a href="https:utkarshmalik211.github.io">Utkarsh Malik</a>, made with
            ❤ for a better web
          </p>
        </Grid>
      </footer>
    );
  }
}

export default Footer;
