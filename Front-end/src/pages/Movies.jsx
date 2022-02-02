import React, { Component } from "react";
import Idm from "../services/Idm";
import {withRouter} from "react-router-dom";
import "../css/movies.css";


// const localStorage = require("local-storage");

class Movies extends Component {
  state = {
    genre : "",
    director_name:"",
    orderBy:"",
    direction:"",
    year:"",
    title_name:"",
    result:[],
    response:"",
    test:[],
    shown:false,
    keyword:"",
    limit:10,
    offset:0,
    page:0,
    next:false
  };
  updateField = e => {
    const { name, value } = e.target;

    this.setState({ [name]: value });
  };
  updateNumField = e => {
    const { name, value } = e.target;

    this.setState({ [name]: parseInt(value) });
  };
  searchMovie = () => {
    const{genre, director_name,year,title_name,orderBy,direction,limit,offset} = this.state;
    Idm.search(genre, director_name,year,title_name,orderBy,direction,limit,0)
    .then(response => {
      if(response.data.resultCode === 210)
      {
        console.log("inside search");
        this.setState({result: response.data.movies});
        this.setState({shown:true});
        console.log(response.data.movies);
        if(this.state.result.length===limit)
        {
          this.setState({next:true})
        }
        else
        {
          this.setState({next:false})
        }
      }
      else
      {
        this.setState({response : response.data.message});
      }
    }
    )
    .catch(error => alert(error));
  };

  searchMovieNext = () => {
    const{genre, director_name,year,title_name,orderBy,direction,limit,offset} = this.state;
    const newOff = offset+limit
    Idm.search(genre, director_name,year,title_name,orderBy,direction,limit,newOff)
    .then(response => {
      if(response.data.resultCode === 210)
      {
        console.log("inside search");
        this.setState({result: response.data.movies});
        this.setState({shown:true});
        console.log(response.data.movies);
        if(this.state.result.length===limit)
        {
          
          this.setState({next:true})
          this.setState({offset:newOff})
        }
        if(this.state.result.length < limit)
        {
          this.setState({next:false})
        }
      }
      else
      {
        this.setState({response : response.data.message});
      }
    }
    )
    .catch(error => alert(error));
  };
  refreshPage = () => {
    window.location.reload(); 
  }

  browseMovie = () => {
    const{keyword,orderBy,direction} = this.state;
    Idm.browse(keyword,orderBy,direction)
    .then(response => {
      if(response.data.resultCode === 210)
      {
        console.log("inside browse");
        this.setState({result: response.data.movies});
        this.setState({shown:true});
        console.log(response.data.movies);
      }
      else
      {
        this.setState({response : response.data.message});
      }
    }
    )
    .catch(error => alert(error));
  };

  random = (name,id) =>{
    localStorage.setItem("random1",name);
    localStorage.setItem("random2",id);
    this.props.history.push("/movieDetail");
  };
  
  render() {
    const {option, query,result,response,shown,next} = this.state;
    const Product = ({id,title,director,year,rating, img_url}) => {
      return(
              <div className = "child">
                  <img src={"https://image.tmdb.org/t/p/w185" + img_url}/>
                  <h4>{id}</h4>
                  <h4>{title}</h4>
                  <h4>{director}</h4>
                  <h4>{year}</h4>
                  <h4>{rating}</h4>
                  <button onClick = {()=>this.random(title,id)}>details</button>
              </div>
      );
  };
    return (
        <div>
          <div>
            

          <div className = "flex-container">
            
            <div className = "child">
            <h3>Search with parameters</h3><input type="text" placeholder="title name" name="title_name" onChange={this.updateField}/>
              <input type="text" placeholder="director name" name="director_name" onChange={this.updateField}/>
              <input type="text" placeholder="year" name="year" onChange={this.updateField}/>
              
              <button type = "submit" formMethod="get" value = {query} className = "button1" onClick = {this.searchMovie}>Search</button>
              </div>

              <div className = "child">
            <h3>Search with keyword</h3><input type="text" placeholder="keywords" name="keyword" onChange={this.updateField}/>
              
              <button type = "submit" formMethod="get" value = {query} className = "button1" onClick = {this.browseMovie}>Search</button>
              </div>


          </div>

          <div className = "child-more">
          genre <select className = "dropdown-content" id="search-option" name = "genre" onChange={this.updateField}>
              <option value=""> </option>
              <option value="Action">Action</option>
              <option value="Adventure">Adventure</option>
              <option value="Animation">Animation</option>
              <option value="Comedy">Comedy</option>
              <option value="Crime">Crime</option>
              <option value="Documentary">Documentary</option>
              <option value="Drama">Drama</option>
              <option value="Family">Family</option>
              <option value="Fantasy">Fantasy</option>
              <option value="History">History</option>
              <option value="Horror">Horror</option>
              <option value="Music">Music</option>
              <option value="Mystery">Mystery</option>
              <option value="Romance">Romance</option>
              <option value="Science Fiction">Science Fiction</option>
              <option value="Thriller">Thriller</option>
              <option value="TV Movie">TV Movie</option>
              <option value="War">War</option>
              <option value="Western">Western</option>
            </select>
            orderBy <select className = "dropdown-content" id="search-option" name = "orderBy" onChange={this.updateField}>
              <option value=""> </option>
              <option value="title">title</option>
              <option value="rating">rating</option>
              <option value="year">year</option>
            </select>
            direction <select className = "dropdown-content" id="search-option" name = "direction" onChange={this.updateField}>
              <option value=""> </option>
              <option value="asc">asc</option>
              <option value="desc">desc</option>
            </select>
            limit <select className = "dropdown-content" id="search-option" name = "limit" onChange={this.updateNumField}>
              <option value="10">10 </option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            offset <select className = "dropdown-content" id="search-option" name = "page" onChange={this.updateNumField}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            {/* <button onClick = {this.refreshPage}>Clear Results</button> */}
          </div>



            
          </div>
          <div>
            {shown &&
              <div className="flex-container">
              {result.map((value,key) => <Product key = {value.movie_id} id={value.movie_id} title = {value.title} director = {value.director} year = {value.year} rating={value.rating} img_url = {value.poster_path}/>)}
              </div>
            }
          </div>
          <div>
            {next &&
                <div>
                <button type = "submit" formMethod="get" value = {query} className = "button1" onClick = {this.searchMovieNext}>Next</button>
                </div>
              }
          </div>
          {response}
        </div>
    );
          }
}

export default withRouter(Movies);
