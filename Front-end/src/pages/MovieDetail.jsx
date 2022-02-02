import React, { Component } from "react";
import Idm from "../services/Idm";
import "../css/movies.css";


const localStorage = require("local-storage");
class MovieDetail extends Component {
  state = {
    current_id: localStorage.get("random2"),
    result:[],
    quantity:0,
    shown:false,
    email: localStorage.get("email"),
    message:"",
    addShown: false
  };

  componentDidMount(){
    this.getDetail(this.state.current_id);
  }

  updateField = e => {
    const { name, value } = e.target;

    this.setState({ [name]: value });
  };
  updateNumField = e => {
    const { name, value } = e.target;

    this.setState({ [name]: parseInt(value) });
  };

  getDetail = (id) =>{
    Idm.movieDetail(id)
    .then(response =>{
      if(response.data.resultCode ===210)
      {
        this.setState({result: [response.data.movie]});
        this.setState({shown: true});
        console.log(response.data.movie)
      }
    })
  };

  addToCart = (email,id,quantity) => {
    this.setState({addShown: true});
    Idm.addToCart(email,id,quantity)
    .then(response => {
      if(response.data.resultCode===3100)
      {
        this.setState({message: "Added succesfully"});
      }
      else
      {
        this.setState({message: response.data.message});
      }
    })
  }

  render() {
    const{result,quantity,current_id,shown,email,addShown,message} = this.state;
    const Product = ({id,title,director,year,rating,num_votes,people,genre,budget,revenue,overview,img_url}) => {
      return(
              <div className = "flex-container">
                <div className = "child-image">
                  <img src={"https://image.tmdb.org/t/p/w300" + img_url}/>
                </div>
                <div className = "child-moremore">
                <h4>movie_id: {id}</h4>
                  <h4>title: {title}</h4>
                  <h4>director: {director}</h4>
                  <h4>year: {year}</h4>
                  <h4>rating: {rating}</h4>
                  <h4>num_votes: {num_votes}</h4>
                  <h4>budget: {budget} USD</h4>
                  <h4>revenue: {revenue} USD</h4>
                  <h4>overview:</h4>
                  <p>{overview}</p>
                  <ul>
                    <h4>people:</h4> 
                    {people.slice(0,5).map((value,key) => <li key = {value.genre_id}>{value.name}</li>)}
                    <li>... more</li>
                  </ul>
                  <ul>
                    <h4>genre:</h4> 
                    {genre.map((value,key) => <li>{value.name}</li>)}
                  </ul>
                </div>
                  
              </div>
      );
  };
    return (
      <div>
        <div className="flex-container">
          {result.map((value,key) => 
            <Product
              id={value.movie_id} 
              title = {value.title} 
              director = {value.director} 
              year = {value.year}
              rating={value.rating}
              num_votes={value.num_votes}
              people = {value.people}
              genre = {value.genres}
              budget = {value.budget}
              revenue = {value.revenue}
              overview = {value.overview}
              img_url = {value.poster_path}/>)}
        </div>
        {shown&&
          <div className="child-haha">
            <input type = "number" min ="1" max = "100" name = "quantity" onChange = {this.updateNumField}/>
            <button className = "cart-button" onClick = {()=>this.addToCart(email,current_id,quantity)}>add to cart</button>
          </div>
        }
        {addShown &&
          <div>
            {message}
          </div>
          
        }
      </div>
      
  );
}
}
export default MovieDetail;