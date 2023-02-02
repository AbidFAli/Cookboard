import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import React, { useRef, useState } from "react";
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import "./App.css";
import { AppBar } from "./components/AppBar";
import { SnackbarProvider } from "./components/NotificationSnackbar";
import { RecipeSwitch } from "./components/RecipeSwitch";
import { LoginWindow } from "./components/pages/LoginWindow.js";
import { MyRecipesPage } from "./components/pages/MyRecipesPage.js";
import { HomePage } from "./components/pages/home-page/HomePage";
import * as paths from "./paths.js";

const theme = createMuiTheme();

// const navTabs = [
//   { link: "/search/", name: "Search" },
//   { link: "/recipes/browse", name: "Browse Recipes" },
//   { link: "/meals/plan", name: "Plan Meals" },
//   { link: "/pantry/", name: "My Pantry" },
//   { link: "/grocerylist/", name: "Grocery List" },
//   { link: "/favs/", name: "Favorites" }
// ];

const App = (props) => {
  const [user, setUser] = useState(undefined);
  const snackbarRef = useRef({});

  const clearUser = () => {
    setUser(undefined);
  };

  let appBar = (
    <React.Fragment>
      <AppBar user={user} clearUser={clearUser} />
      <Toolbar />
    </React.Fragment>
  );

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CssBaseline />
        <Container maxWidth="md">
          {appBar}
          <Switch>
            <Route path={paths.PATH_MYRECIPES}>
              <MyRecipesPage user={user} snackbarRef={snackbarRef} />
            </Route>
            <Route path={paths.PATH_RECIPES}>
              <RecipeSwitch user={user} snackbarRef={snackbarRef} />
            </Route>
            <Route path={paths.PATH_LOGIN}>
              <LoginWindow user={user} updateUser={setUser} />
            </Route>
            <Route path={paths.PATH_HOME}>
              <HomePage />
            </Route>
            <Route path="/" render={() => <Redirect to={paths.PATH_HOME} />} />
          </Switch>
          <SnackbarProvider ref={snackbarRef} />
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export { App };
