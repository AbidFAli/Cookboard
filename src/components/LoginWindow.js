import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { PATH_MYRECIPES } from '../paths';
import { ERROR_INVALID_PASSWORD, ERROR_OTHER, userService } from '../services/userService';


const KEY_USER_STORAGE = "CookboardUserLocalStorage"

const ID_BUTTON_LOG_IN = "buttonLogin"
const ID_BUTTON_SIGN_UP = "buttonSignup"
const ID_INPUT_USERNAME = "inputUsername"
const ID_INPUT_PASSWORD = "inputPassword"

const MESSAGE_USERNAME_MISSING = "Enter a username"
const MESSAGE_PASSWORD_MISSING = "Enter a password"
const MESSAGE_INVALID_PASSWORD = "The password you entered was incorrect"




const LoginWindow = ({user, updateUser}) => {
  const history = useHistory()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('') //maybe do this one uncontrolled for security?
  const [errorUsername, setErrorUsername] = useState('')
  const [errorPassword, setErrorPassword] = useState('')
  
  useEffect(() => {
    if(user === undefined && localStorage.getItem(KEY_USER_STORAGE)){
      let storedUser = JSON.parse(localStorage.getItem(KEY_USER_STORAGE))
      userService.isTokenValid(storedUser.token).then((isValid) => {
        if(isValid){
          updateUser(storedUser)
          history.push(PATH_MYRECIPES)
        }
      })

    }
  }, [user, updateUser])

  const handleUsernameChange = (text) => {
    setUsername(text)
    setErrorUsername('')
  }

  const handlePasswordChange = (text) => {
    setPassword(text)
    setErrorPassword('')
  }

  //add type = "password" to password input later
  return (
    <Grid container spacing = {2} justify = "center" alignItems = "center" direction = "column">
      <Grid item>
        <Typography variant = "h1">Cookboard</Typography>
      </Grid>
      <Grid item container spacing = {2} direction = "column" justify = "center" alignItems = "center">
        <Grid item>
          <TextField 
            label = "Username" 
            helperText = {errorUsername}
            error = {errorUsername !== ''}
            onChange = {(event) => handleUsernameChange(event.target.value)}
            inputProps = {{'data-testid' : ID_INPUT_USERNAME}}
            />
        </Grid>
        <Grid item> 
            <TextField 
              label = "Password" 
              helperText = {errorPassword}
              error = {errorPassword !== ''}
              onChange = {(event) => handlePasswordChange(event.target.value)}
              inputProps = {{'data-testid': ID_INPUT_PASSWORD}}
              />
        </Grid>
        <Grid item container justify = "center" alignItems = "center">
          <Grid item>
            <LoginButton 
              username = {username} 
              password = {password} 
              updateUser = {updateUser}
              setErrorPassword = {setErrorPassword}
              setErrorUsername = {setErrorUsername} />
          </Grid>
          <Grid item>
            <Button variant = "contained" color = "primary" data-testid = {ID_BUTTON_SIGN_UP}>Sign Up</Button>
          </Grid>
        </Grid> 
      </Grid>
    </Grid>
  )
}

const LoginButton = ({username, password, updateUser, setErrorPassword, setErrorUsername}) => {
  const history = useHistory()

  const checkForErrors = () => {
    let hasError = false;
    if(username.trim() === ''){
      setErrorUsername(MESSAGE_USERNAME_MISSING)
      hasError = true;
    }

    if(password.trim() === ''){
      setErrorPassword(MESSAGE_PASSWORD_MISSING)
      hasError = true;
    }
    return hasError;
  }


  const handleLogin = async () => {
    let hasInitialError = checkForErrors();

    if(!hasInitialError){
      let user = await userService.login(username, password)
      if(user !== ERROR_INVALID_PASSWORD && user !== ERROR_OTHER){
        localStorage.setItem(KEY_USER_STORAGE, JSON.stringify(user))
        updateUser(user)
        history.push(`/myrecipes`)
      }
      else if(user === ERROR_INVALID_PASSWORD){
        setErrorPassword(MESSAGE_INVALID_PASSWORD)
      }
    } 
  }

  return (
        <Button 
          variant = "contained" 
          color = "primary" 
          data-testid = {ID_BUTTON_LOG_IN}
          onClick = {() => handleLogin()}>Log In</Button>
  )
}



export {
  LoginWindow,
  MESSAGE_INVALID_PASSWORD,
  MESSAGE_USERNAME_MISSING,
  MESSAGE_PASSWORD_MISSING,
  ID_BUTTON_LOG_IN,
  ID_BUTTON_SIGN_UP,
  ID_INPUT_USERNAME,
  ID_INPUT_PASSWORD,
  KEY_USER_STORAGE
};

