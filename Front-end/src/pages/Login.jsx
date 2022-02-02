import React, { Component } from "react";

import Idm from "../services/Idm";

import "../css/common.css";

const localStorage = require("local-storage");

class Login extends Component {
  state = {
    email: "",
    password: "",
    response:""
  };

  handleSubmit = e => {
    e.preventDefault();

    const { handleLogIn } = this.props;
    const { email, password } = this.state;

    Idm.login(email, password)
      .then(response => {
        if(response.data.resultCode === 120)
        {
          handleLogIn(email,response.data.session_id);
        }
        else
        {
          this.setState({response : response.data.message});
        }
      }
      )
      .catch(error => console.log(error));
  };

  updateField = ({ target }) => {
    const { name, value } = target;

    this.setState({ [name]: value });
  };

  render() {
    const { email, password, response } = this.state;

    return (
      <body>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            name="email"
            value={email}
            onChange={this.updateField}
          ></input>
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            name="password"
            value={password}
            onChange={this.updateField}
          ></input>
          <button className="button">Login</button>
          <p>{response}</p>
        </form>
      </body>
    );
  }
}

export default Login;
