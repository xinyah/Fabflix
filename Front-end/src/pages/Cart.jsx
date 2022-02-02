import React, { Component } from "react";
import Idm from "../services/Idm";
import {withRouter} from "react-router-dom";
import "../css/movies.css";

// const localStorage = require("local-storage");

class Cart extends Component {
  state = {
    result : [],
    email : localStorage.getItem("email"),
    shown:false,
    quantity:0,
    link:""
  };
  
  componentDidMount(){
    console.log("inside cart")
    console.log(this.state.email);
    this.getDetail(localStorage.getItem("email"));
  }

  updateNumField = e => {
    const { name, value } = e.target;

    this.setState({ [name]: parseInt(value) });
  };

  getDetail = (email) =>{
    Idm.cartDetail(email)
    .then(response =>{
      if(response["data"]["resultCode"] ===3130)
      {
        this.setState({result: response["data"]["items"] });
        if(this.state.result.length>0){
        this.setState({shown: true});}
        console.log(response.data.items)
      }
    })
  };

  updateQuantity=(email,id,quantity) =>
  {
    Idm.updateCart(email,id,quantity)
    .then(response => {
      if(response.data.resultCode ===3110)
      {
        console.log("successfully updated")
        window.location.reload(); 
      }
    }
    )
  };

  removeAll = (email,id) =>
  {
    Idm.removeItem(email,id)
    .then(response => {
      if(response.data.resultCode === 3120)
      {
        console.log("removed successfully")
        window.location.reload(); 
      }
    }

    )
  };

  placeOrder = (email) =>
  {
    Idm.placeOrder(email)
    .then(response =>{
      if(response["data"]["resultCode"] ===3400)
      {
        console.log("inside placeOrder")
        console.log(response.data.approve_url)
        window.location.replace(response.data.approve_url)
        // this.setState({link:response.data.approve_url})
      }
    }

    )
  }

  render() {
    const{result,email,shown,link} = this.state;
    const Product = ({email,id,title,quantity,unit_price,discount,img_url}) => {
      return(
              <div className = "child-hahaha" id = {id+1}>
                <img src={"https://image.tmdb.org/t/p/w185" + img_url}/>
                  <h4>title: {title}</h4>
                  <h4>quantity: 
                    <select className = "dropdown-content" id={id} name = "quantity" defaultValue = {this.state.quantity} onChange={this.updateNumField}>
                      <option value={quantity}> {quantity}</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                    </select>
                  </h4>
                  <h4>total_price: {(unit_price*(1-discount)*quantity).toFixed(2)}</h4>
                  <button onClick = {()=>this.updateQuantity(email,id,this.state.quantity)}>Update</button>
                  <div>
                    <button onClick = {()=>this.removeAll(email,id)}>Remove All</button>
                  </div>
              </div>
      );
  };
  const totalValue = result.reduce((total,r) =>  parseFloat(total)+parseFloat((r.unit_price*(1-r.discount)*r.quantity).toFixed(2)),0.0);
    return (
      
      <div>
        
        {
        shown &&
          <div>
            <div className="flex-container">
            {result.map((value,key) => 
              <Product
                key = {value.movie_id}
                email = {value.email}
                id = {value.movie_id}
                title = {value.movie_title} 
                quantity = {value.quantity}
                unit_price = {value.unit_price}
                discount = {value.discount}
                img_url = {value.poster_path}/>)}
            </div>
            <div className = "child-hahaha">
              <h4>Cart Total : {totalValue}</h4>
              <button onClick = {() => this.placeOrder(email)}>Place an Order</button>
            </div>
          </div>
          
        }

      </div>
      
  );
}
}
export default withRouter(Cart);