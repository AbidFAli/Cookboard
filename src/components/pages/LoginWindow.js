import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
//import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { PATH_LOGIN, PATH_MYRECIPES, PATH_REGISTRATION } from "../../paths";
import {
  ERROR_INCORRECT_PASSWORD,
  ERROR_OTHER,
  userService,
} from "../../services/userService";
import { isUsernameTakenError } from "../../util/errors";

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 40;

const KEY_USER_STORAGE = "CookboardUserLocalStorage";

const ID_BUTTON_LOG_IN = "buttonLogin";
const ID_BUTTON_SIGN_UP = "buttonSignup";
const ID_BUTTON_CANCEL_SIGNUP = "buttonCancelSignup";
const ID_INPUT_USERNAME = "inputUsername";
const ID_INPUT_PASSWORD = "inputPassword";
const ID_INPUT_CONFIRM_PASSWORD = "inputConfirmPassword";
const ID_INPUT_EMAIL = "inputEmail";

const MESSAGE_USERNAME_MISSING = "Enter a username";
const MESSAGE_USERNAME_NOT_UNIQUE = "This username is taken";
const MESSAGE_PASSWORD_MISSING = "Enter a password";
const MESSAGE_INCORRECT_PASSWORD = "The password you entered was incorrect";
const MESSAGE_PASSWORD_MATCH = "Password must match";
const MESSAGE_EMAIL_MISSING = "Please enter an email";
const MESSAGE_INVALID_PASSWORD_CHARACTER = "Spaces and <>\\ are not allowed";
const MESSAGE_PASSWORD_TOO_SHORT = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;

const errorMessages = {
  MESSAGE_USERNAME_MISSING,
  MESSAGE_USERNAME_NOT_UNIQUE,
  MESSAGE_PASSWORD_MISSING,
  MESSAGE_INCORRECT_PASSWORD,
  MESSAGE_PASSWORD_MATCH,
  MESSAGE_EMAIL_MISSING,
  MESSAGE_INVALID_PASSWORD_CHARACTER,
  MESSAGE_PASSWORD_TOO_SHORT,
};

const ids = {
  ID_BUTTON_LOG_IN,
  ID_BUTTON_SIGN_UP,
  ID_BUTTON_CANCEL_SIGNUP,
  ID_INPUT_USERNAME,
  ID_INPUT_PASSWORD,
  ID_INPUT_CONFIRM_PASSWORD,
  ID_INPUT_EMAIL,
};

const LoginWindow = ({ user, updateUser }) => {
  const history = useHistory();

  const [registering, setRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorUsername, setErrorUsername] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");

  useEffect(() => {
    if (user === undefined && localStorage.getItem(KEY_USER_STORAGE)) {
      let storedUser = JSON.parse(localStorage.getItem(KEY_USER_STORAGE));
      userService.isTokenValid(storedUser.token).then((isValid) => {
        if (isValid) {
          updateUser(storedUser);
          history.push(PATH_MYRECIPES);
        }
      });
    }
  }, [user, updateUser]);

  const restorePage = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setEmail("");
    setErrorUsername("");
    setErrorPassword("");
    setErrorEmail("");
  };

  const startRegistering = () => {
    setRegistering(true);
    history.push(PATH_REGISTRATION);
  };
  const cancelRegistering = () => {
    setRegistering(false);
    restorePage();
    history.push(PATH_LOGIN);
  };

  //makes the request to
  const handleSignup = async () => {
    try {
      if (!checkForErrors()) {
        await userService.create({ username, password, email });
        handleLogin();
      }
    } catch (error) {
      if (isUsernameTakenError(error)) {
        setErrorUsername(MESSAGE_USERNAME_NOT_UNIQUE);
      } else {
        console.log(error);
      }
    }
  };

  const handleUsernameChange = (text) => {
    setUsername(text);
    if (text.trim() === "") {
      setErrorUsername(MESSAGE_USERNAME_MISSING);
    } else {
      setErrorUsername("");
    }
  };

  const checkPasswordErrors = (password, confirmPassword) => {
    let hasErrors = true;
    let errorMessage = "";
    if (password === "") {
      errorMessage = MESSAGE_PASSWORD_MISSING;
    } else if (registering && password.match(/[\s\\<>]/)) {
      errorMessage = MESSAGE_INVALID_PASSWORD_CHARACTER;
    } else if (registering && password.length < MIN_PASSWORD_LENGTH) {
      errorMessage = MESSAGE_PASSWORD_TOO_SHORT;
    } else if (registering && confirmPassword !== password) {
      errorMessage = MESSAGE_PASSWORD_MATCH;
    } else {
      hasErrors = false;
    }

    setErrorPassword(errorMessage);
    return hasErrors;
  };

  const handlePasswordChange = (text) => {
    if (text.length <= MAX_PASSWORD_LENGTH) {
      setPassword(text);
      checkPasswordErrors(text, confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (text) => {
    if (text.length <= MAX_PASSWORD_LENGTH) {
      setConfirmPassword(text);
      checkPasswordErrors(password, text);
    }
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (text.trim() === "") {
      setErrorEmail(MESSAGE_EMAIL_MISSING);
    } else {
      setErrorEmail("");
    }
  };

  const handleLogin = async () => {
    let hasInitialError = checkForErrors();
    try {
      if (!hasInitialError) {
        let user = await userService.login(username, password);
        if (user !== ERROR_INCORRECT_PASSWORD && user !== ERROR_OTHER) {
          localStorage.setItem(KEY_USER_STORAGE, JSON.stringify(user));
          updateUser(user);
          history.push(`/myrecipes`);
        } else if (user === ERROR_INCORRECT_PASSWORD) {
          setErrorPassword(MESSAGE_INCORRECT_PASSWORD);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkForErrors = () => {
    let hasErrors = false;

    //check for blank fields
    if (username.trim() === "") {
      setErrorUsername(MESSAGE_USERNAME_MISSING);
      hasErrors = true;
    }

    hasErrors = checkPasswordErrors(password, confirmPassword) || hasErrors;

    if (registering) {
      if (email.trim() === "") {
        setErrorEmail(MESSAGE_EMAIL_MISSING);
        hasErrors = true;
      }
    }
    //also check for other error messages
    hasErrors =
      hasErrors ||
      errorUsername !== "" ||
      errorPassword !== "" ||
      errorEmail !== "";
    return hasErrors;
  };

  let fieldUsername = (
    <TextField
      label="Username"
      value={username}
      helperText={errorUsername}
      error={errorUsername !== ""}
      onChange={(event) => handleUsernameChange(event.target.value)}
      inputProps={{ "data-testid": ID_INPUT_USERNAME }}
      id={ID_INPUT_USERNAME}
    />
  );
  let fieldPassword = (
    <TextField
      label="Password"
      type="password"
      value={password}
      helperText={errorPassword}
      error={errorPassword !== ""}
      onChange={(event) => handlePasswordChange(event.target.value)}
      inputProps={{ "data-testid": ID_INPUT_PASSWORD }}
      id={ID_INPUT_PASSWORD}
    />
  );
  let fieldPasswordConfirm = (
    <TextField
      label="Re-enter your password"
      type="password"
      value={confirmPassword}
      helperText=""
      onChange={(event) => handleConfirmPasswordChange(event.target.value)}
      inputProps={{ "data-testid": ID_INPUT_CONFIRM_PASSWORD }}
      id={ID_INPUT_CONFIRM_PASSWORD}
    />
  );
  let fieldEmail = (
    <TextField
      label="Email"
      value={email}
      helperText={errorEmail}
      error={errorEmail !== ""}
      onChange={(event) => handleEmailChange(event.target.value)}
      inputProps={{ "data-testid": ID_INPUT_EMAIL }}
      id={ID_INPUT_EMAIL}
    />
  );
  let loginButton = (
    <Button
      variant="contained"
      color="primary"
      data-testid={ID_BUTTON_LOG_IN}
      onClick={() => handleLogin()}
    >
      Log In{" "}
    </Button>
  );

  let signupButton = (
    <Button
      variant="contained"
      color="primary"
      data-testid={ID_BUTTON_SIGN_UP}
      disabled={
        !registering
          ? false
          : errorUsername !== "" || errorPassword !== "" || errorEmail !== ""
      }
      onClick={() => (registering ? handleSignup() : startRegistering())}
    >
      Sign Up
    </Button>
  );

  let cancelButton = (
    <Button
      variant="contained"
      color="secondary"
      data-testid={ID_BUTTON_CANCEL_SIGNUP}
      onClick={cancelRegistering}
    >
      Cancel Signup
    </Button>
  );
  let passwordRules = (
    <Paper>
      <Typography variant="subtitle2">Password Rules</Typography>
      <List>
        <ListItem>
          <ListItemText
            primary={`${MIN_PASSWORD_LENGTH} to ${MAX_PASSWORD_LENGTH} characters`}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={
              "Letters, numbers, and other special characters except <>\\"
            }
          />
        </ListItem>
      </List>
    </Paper>
  );

  let fields;
  let buttons;
  if (registering) {
    fields = (
      <React.Fragment>
        <Grid item>{fieldUsername}</Grid>
        <Grid item>{fieldPassword}</Grid>
        <Grid item>{passwordRules}</Grid>
        <Grid item>{fieldPasswordConfirm}</Grid>
        <Grid item>{fieldEmail}</Grid>
      </React.Fragment>
    );
    buttons = (
      <React.Fragment>
        <Grid item>{signupButton}</Grid>
        <Grid item>{cancelButton}</Grid>
      </React.Fragment>
    );
  } else {
    fields = (
      <React.Fragment>
        <Grid item>{fieldUsername}</Grid>
        <Grid item>{fieldPassword}</Grid>
      </React.Fragment>
    );
    buttons = (
      <React.Fragment>
        <Grid item>{loginButton}</Grid>
        <Grid item>{signupButton}</Grid>
      </React.Fragment>
    );
  }

  return (
    <Grid
      container
      spacing={2}
      justify="center"
      alignItems="center"
      direction="column"
    >
      <Grid item>
        <Typography variant="h1">Cookboard</Typography>
      </Grid>
      <Grid item>
        <form>
          <Grid
            item
            container
            spacing={2}
            direction="column"
            justify="center"
            alignItems="center"
          >
            {fields}
            <Grid item container justify="center" alignItems="center">
              {buttons}
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

LoginWindow.propTypes = {
  user: PropTypes.object,
  updateUser: PropTypes.func,
};

export {
  LoginWindow,
  errorMessages,
  ids,
  KEY_USER_STORAGE,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
};
