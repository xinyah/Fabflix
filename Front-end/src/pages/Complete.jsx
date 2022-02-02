import React, { Component } from "react";
import Idm from "../services/Idm";
import {withRouter} from "react-router-dom";

class Complete extends Component {
    state = {
        message:""
    };
    componentDidMount(){
        console.log("inside constructor?")
        this.completeOrder(this.props.location.search);
    }

    completeOrder = (token) =>
    {
        Idm.completeOrder(token)
        .then(response => {
            if(response.data.resultCode === 3420)
            {
                console.log("insideComplete")
                this.setState({message: "Order Completed"});
            }
        }
        )
    }
    render() {
        const{message} = this.state
      return (
        <div>
            <h3>{message}</h3>
        </div>
          
      );
      
    }
  }
  
  export default withRouter(Complete);