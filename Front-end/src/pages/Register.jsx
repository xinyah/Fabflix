import React, { Component } from "react";
import Idm from "../services/Idm";
import "../css/common.css";

const localStorage = require("local-storage");

class Register extends Component {
  state = {
    email: "",
    password: "",
    response:""
  };

  handleSubmit = e => {
    e.preventDefault();
    const { email, password ,response} = this.state;
    //want this.state.email and this.state.password

    Idm.register(email, password)
    .then(response => {
      if(response.data.resultCode === 110)
      {
        this.setState({response: "You can now log in at the login page"});
      }
      else
      {
        this.setState({response : response.data.message});
      }
    }
    )
    .catch(error => alert(error));
  };

  updateField = e => {
    const { name, value } = e.target;

    this.setState({ [name]: value });
  };

  
  render() {
    const { email, password ,response} = this.state;

    return (
      <div className="form-box">
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            name="email"
            value={email}
            onChange={this.updateField}
          />
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            name="password"
            value={password}
            onChange={this.updateField}
          />
          <button className="button">Register</button>
          <p>{response}</p>
        </form>
      </div>
    );
  }
}

export default Register;
