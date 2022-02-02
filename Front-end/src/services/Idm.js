import Socket from "../util/Socket";
import { idmEPs , movieEPs, cartEPs, paypalEPs} from "../Config.json";
import Axios from "axios";

const { loginEP, registerEP} = idmEPs;
const {searchEP,movieDetailEP,browseEP} = movieEPs;
const {cartDetailEP, addToCartEP,updateCartEP,removeItemEP} = cartEPs;
const {placeOrderEP,orderCompleteEP,orderRetrieveEP} = paypalEPs;

async function login(email, password) {
  const payLoad = {
    email: email,
    password: password.split("")
  };

  return await Socket.POST(loginEP, payLoad);
}

async function register(email,password){
  const payLoad = {
    email:email,
    password: password.split("")
  };
  return await Socket.POST(registerEP, payLoad);
}

async function search(genre, director_name,year,title_name,orderBy,direction,limit,offset){
  const { common } = Axios.defaults.headers;
  common["email"] = localStorage.getItem("email");
  console.log(localStorage.getItem("email"));
  const newPATH = searchEP+"?genre="+genre+"&director="+director_name
                                    +"&year="+year
                                    +"&title="+title_name
                                    +"&orderby="+orderBy
                                    +"&direction="+direction
                                    +"&limit="+limit
                                    +"&offset="+offset
  console.log(newPATH)
  return await Socket.GET(newPATH);
}

async function browse(keywords,orderBy,direction)
{
  const { common } = Axios.defaults.headers;
  common["email"] = localStorage.getItem("email");
  const newPATH = browseEP+keywords+"?orderBy="+orderBy+"&direction="+direction
  console.log(newPATH)
  return await Socket.GET(newPATH);
}


async function cartDetail(email)
{
  const { common } = Axios.defaults.headers;
  common["email"] = email;
  const payLoad = {
    email: email
  }
  console.log(email);
  return await Socket.POST(cartDetailEP,payLoad);
}

async function movieDetail(movie_id)
{
  const detailPath = movieDetailEP+movie_id;
  console.log(detailPath);
  return await Socket.GET(detailPath);
}

async function addToCart(email,movie_id,quantity)
{
  const { common } = Axios.defaults.headers;
  common["email"] = email;
  const payLoad = {
    email: email,
    movie_id:movie_id,
    quantity: quantity
  }
  return await Socket.POST(addToCartEP,payLoad);
}
async function updateCart(email,movie_id,quantity)
{
  const { common } = Axios.defaults.headers;
  common["email"] = email;
  const payLoad = {
    email: email,
    movie_id:movie_id,
    quantity: quantity
  }
  return await Socket.POST(updateCartEP,payLoad);
}
async function removeItem(email,movie_id)
{
  const { common } = Axios.defaults.headers;
  common["email"] = email;
  const payLoad = {
    email: email,
    movie_id:movie_id
  }
  return await Socket.POST(removeItemEP,payLoad);
}

async function placeOrder(email)
{
  const { common } = Axios.defaults.headers;
  common["email"] = email;
  const payLoad = {
    email:email
  }
  return await Socket.POST(placeOrderEP,payLoad);
}

async function completeOrder(tokens)
{
  const newPath = orderCompleteEP+tokens
  console.log(newPath)
  return await Socket.GET(newPath);
}

async function orderRetrieve(email)
{
  const { common } = Axios.defaults.headers;
  common["email"] = email;
  const payLoad = {
    email:email
  }
  return await Socket.POST(orderRetrieveEP,payLoad);
}

export default {
  login,
  register,
  search,
  cartDetail,
  movieDetail,
  addToCart,
  updateCart,
  removeItem,
  browse,
  placeOrder,
  completeOrder,
  orderRetrieve
};
