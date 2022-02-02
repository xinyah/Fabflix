import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import Login from "./pages/Login";
import Movies from "./pages/Movies";
import MovieDetail from "./pages/MovieDetail";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import Complete from "./pages/Complete";


class Content extends Component {
  render() {
    const { handleLogIn } = this.props;

    return (
      <div className="content">
        <Switch>
          <Route path="/login" component={props => <Login handleLogIn={handleLogIn} {...props} />} />
          <Route path="/register" component={Register} />
          <Route path="/movies" component={Movies} />
          <Route path="/movieDetail" component = {MovieDetail}/>
          <Route path="/cart" component={Cart} />
          <Route path="/order" component={Order}/>
          <Route path="/complete*" component={Complete}/>
          <Route path="/" component={Home} />
          
        </Switch>
      </div>
    );
  }
}

export default Content;
