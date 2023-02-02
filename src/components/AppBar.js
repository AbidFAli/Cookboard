import { AppBar as MuiAppBar, Toolbar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import PropTypes from "prop-types";
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

const defaultLinks = [
  { name: "Home", path: paths.PATH_HOME },
  { name: "Search", path: paths.PATH_SEARCH },
];

const AppBar = ({ clearUser, user }) => {
  const classes = useStyles();

  /*
   *links: array of {
   *    name,
   *    path
   *}
   */
  const createLinks = (links) => {
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
        {user ? (
          <LogoutButton clearUser={clearUser} />
        ) : (
          createLinks([{ name: "Login", path: paths.PATH_LOGIN }])
        )}
        {createLinks(defaultLinks)}
        {user
          ? createLinks([{ name: "My Recipes", path: paths.PATH_MYRECIPES }])
          : null}
      </Toolbar>
    </MuiAppBar>
  );
};
AppBar.propTypes = {
  user: PropTypes.object,
  clearUser: PropTypes.func,
};

export { AppBar };
