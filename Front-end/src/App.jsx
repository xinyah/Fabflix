import React, { Component } from "react";
import Cookies from "js-cookie";
import Axios from "axios";

import NavBar from "./NavBar";
import Content from "./Content";
import {withRouter} from "react-router-dom";

class App extends Component {
  state = {
    loggedIn: this.checkedLoggedIn()
  };

  handleLogIn = (email, session_id, transaction_id) => {
    const { common } = Axios.defaults.headers;

    Cookies.set("email", email);
    Cookies.set("session_id", session_id);

    localStorage.setItem("email",email);
    localStorage.setItem("session_id",session_id);
    localStorage.setItem("transaction_id",transaction_id);

    console.log(session_id);

    common["email"] = email;
    common["session_id"] = session_id;
    common["transaction_id"] = transaction_id;

    this.setState({ loggedIn: true });
    this.props.history.push("/movies");
  };

  handleLogOut = () => {
    const { common } = Axios.defaults.headers;

    Cookies.remove("email");
    Cookies.remove("session_id");

    localStorage.removeItem("email");
    localStorage.removeItem("session_id");
    localStorage.removeItem("transaction_id");

    delete common["email"];
    delete common["session_id"];
    delete common["transaction_id"];

    this.setState({ loggedIn: false });
    this.props.history.push("/login");
  };

  checkedLoggedIn() {
    return (
      Cookies.get("email") !== undefined &&
      Cookies.get("session_id") !== undefined
    );
  }

  render() {
    const { loggedIn } = this.state;

    return (
      <div className="app">
        <NavBar handleLogOut={this.handleLogOut} loggedIn={loggedIn} />
        <Content handleLogIn={this.handleLogIn} />
      </div>
    );
  }
}

export default withRouter(App);
