import { AppBar as MuiAppBar, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import * as paths from "../paths";
import { LogoutButton } from "./LogoutButton";

const useStyles = makeStyles({
  link: {
    color: "white",
    textDecoration: "none",
    margin: "0 1%",
  },
  root: {
    display: "flex",
  },
});

const links = [
  { name: "Search", path: paths.PATH_SEARCH },
  { name: "Login", path: paths.PATH_LOGIN },
  { name: "Home", path: paths.PATH_HOME },
];

const AppBar = ({ clearUser, user }) => {
  const classes = useStyles();

  /*
   *links: array of {
   *    name,
   *    path
   *}
   */
  const createLinks = () => {
    let content = links.map((link) => {
      return (
        <Link key={link.name} className={classes.link} to={link.path}>
          {link.name}
        </Link>
      );
    });
    return content;
  };

  return (
    <MuiAppBar>
      <Toolbar className={classes.root}>
        {user ? <LogoutButton clearUser={clearUser} /> : null}
        {createLinks()}
      </Toolbar>
    </MuiAppBar>
  );
};
AppBar.propTypes = {
  user: PropTypes.object,
  clearUser: PropTypes.func,
};

export { AppBar };
