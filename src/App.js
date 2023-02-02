import { StyledEngineProvider, createTheme } from "@mui/material";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import { ThemeProvider } from "@mui/material/styles";
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

const theme = createTheme();

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
    <StyledEngineProvider injectFirst>
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
              <Route
                path="/"
                render={() => <Redirect to={paths.PATH_HOME} />}
              />
            </Switch>
            <SnackbarProvider ref={snackbarRef} />
          </Container>
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export { App };
