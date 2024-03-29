import axios from 'axios';

const LOGIN_URL = `${process.env.REACT_APP_API_BASE_URL}/login`
const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/users`

//login errors
const ERROR_INCORRECT_PASSWORD = "The provided password was incorrect"
const ERROR_USER_NOT_FOUND = "No users with the provided username exist"
const ERROR_OTHER = "other error"

//gets you the user information + a token authenticating the user
const login = async (username, password) => {
  try{
    const result = await axios.post(LOGIN_URL + '/', { username, password });
    return result.data;
  }
  catch(error){
    if(error.response.status === 401){
       return ERROR_INCORRECT_PASSWORD
    }
    else if(error.response.status === 404){
      return ERROR_USER_NOT_FOUND
    }
    else{
      throw error;
    }
  }
}

const isTokenValid = async(token) => {
  try{
    const result = await axios.post(LOGIN_URL + '/valid', {token})
    return result.data.tokenValid;
  }
  catch(error){
    console.log(error);
  }
}

const create = async (user) => {
    const result = await axios.post(BASE_URL + '/',
    {
      username: user.username,
      password: user.password,
      email: user.email
    });
    
    return result.data;

}

//just gets the user's information
const getById = async (userId) => {
  try{
    const response = await axios.get(BASE_URL+ "/" + userId);
    return response.data;
  }
  catch(error){
    console.log(error)
  }
}

const userService = {
  login, create, getById, isTokenValid
}

export {
  userService,
  ERROR_INCORRECT_PASSWORD,
  ERROR_OTHER,
  ERROR_USER_NOT_FOUND
};

