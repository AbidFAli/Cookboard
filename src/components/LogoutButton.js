import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import React from "react";
import { useHistory } from "react-router";
import { PATH_LOGIN } from "../paths";
import { KEY_USER_STORAGE } from "./pages/LoginWindow";

const LogoutButton = ({ clearUser }) => {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem(KEY_USER_STORAGE);
    clearUser();
    history.push(PATH_LOGIN);
  };
  return (
    <Button
      onClick={() => {
        handleLogout();
      }}
    >
      Logout
    </Button>
  );
};

LogoutButton.propTypes = {
  clearUser: PropTypes.func,
};
export { LogoutButton };
