import React, { Component } from "react";
import Idm from "../services/Idm";
import {withRouter} from "react-router-dom";
import "../css/movies.css";

class Order extends Component {
    state = {
      result : []
    };
    componentDidMount(){
      this.retrieveOrder(localStorage.getItem("email"))
    }
    retrieveOrder = (email) =>
    {
      Idm.orderRetrieve(email)
      .then(response => {
        if(response["data"]["resultCode"]===3410)
        {
            this.setState({result: response["data"]["transactions"]});
            console.log(response["data"]["transactions"])
        }
      })
    }
    render() {
      const{result} = this.state;
      const Product = ({amount,create_time}) => {
        return(
                <div className = "child">
                    <h4>total amount: {amount}</h4>
                    <h4>created time: {create_time}</h4>
                    {/* <h4>{director}</h4> */}
                    {/* <h4>{year}</h4> */}
                    {/* <h4>{rating}</h4> */}
                    {/* <button onClick = {()=>this.random(title,id)}>details</button> */}
                </div>
        );
    };
      return (
          <div>
            <div className="flex-container">
              {result.map((value,key) => 
              <Product key = {value.movie_id} 
                amount={value.amount.total} 
                create_time = {value.create_time} />)}
            </div>
          </div>
          
      );
    }
  }
  
  export default withRouter(Order);