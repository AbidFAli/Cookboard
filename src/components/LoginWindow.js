import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { ERROR_INVALID_PASSWORD, ERROR_OTHER, userService } from '../services/userService';



const ID_BUTTON_LOG_IN = "buttonLogin"
const ID_BUTTON_SIGN_UP = "buttonSignup"
const ID_INPUT_USERNAME = "inputUsername"
const ID_INPUT_PASSWORD = "inputPassword"

const MESSAGE_USERNAME_MISSING = "Enter a username"
const MESSAGE_PASSWORD_MISSING = "Enter a password"
const MESSAGE_INVALID_PASSWORD = "The password you entered was incorrect"


const LoginWindow = ({updateUser}) => {
  

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('') //maybe do this one uncontrolled for security?
  const [errorUsername, setErrorUsername] = useState('')
  const [errorPassword, setErrorPassword] = useState('')
  

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
        <Grid item justify = "center"> 
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
              setErrorPassword = {setErrorPassword}/>
          </Grid>
          <Grid item>
            <Button variant = "contained" color = "primary" data-testid = {ID_BUTTON_SIGN_UP}>Sign Up</Button>
          </Grid>
        </Grid> 
      </Grid>
    </Grid>
  )
}

const LoginButton = ({username, password, updateUser, setErrorPassword}) => {
  const history = useHistory()

  const handleLogin = async () => {
    let user = await userService.login(username, password)
    if(user !== ERROR_INVALID_PASSWORD && user !== ERROR_OTHER){
      updateUser(user)
      history.push(`/myrecipes`)
    }
    else if(user === ERROR_INVALID_PASSWORD){
      setErrorPassword(MESSAGE_INVALID_PASSWORD)
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
  ID_INPUT_PASSWORD
};

