import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import React, { useRef, useState } from 'react';
import {
  BrowserRouter as Router, Redirect, Route, Switch
} from "react-router-dom";
import './App.css';
import { AppBar } from './components/AppBar';
import { SnackbarProvider } from './components/NotificationSnackbar';
import { LoginWindow } from './components/pages/LoginWindow.js';
import { MyRecipesPage } from './components/pages/MyRecipesPage.js';
import { RecipeBrowser } from './components/pages/recipe-browser/RecipeBrowser';
import { RecipeSwitch } from './components/RecipeSwitch';
import * as paths from './paths.js';




// const navTabs = [
//   { link: "/search/", name: "Search" },
//   { link: "/recipes/browse", name: "Browse Recipes" },
//   { link: "/meals/plan", name: "Plan Meals" },
//   { link: "/pantry/", name: "My Pantry" },
//   { link: "/grocerylist/", name: "Grocery List" },
//   { link: "/favs/", name: "Favorites" }
// ]; 


const App = (props) =>  {
  const [user, setUser] = useState(undefined)
  const snackbarRef = useRef({})

  const clearUser = () => {
    setUser(undefined)
  }

  let appBar = (
    <React.Fragment>
      <AppBar user = {user} clearUser = {clearUser} />
      <Toolbar />
    </React.Fragment>
    
  )


  return (
    <Router>
      <CssBaseline />
      <Container maxWidth='md'>
        {appBar}
        <Switch>  
            <Route path={paths.PATH_MYRECIPES}>
              <MyRecipesPage user = {user} snackbarRef = {snackbarRef} /> 
            </Route>
            <Route path = {paths.PATH_RECIPES} >
              <RecipeSwitch user = {user} snackbarRef = {snackbarRef}/>
            </Route>
            <Route path = {paths.PATH_SEARCH} >
              <RecipeBrowser snackbarRef = {snackbarRef} />
            </Route>
            <Route path = {paths.PATH_LOGIN}>
              <LoginWindow user = {user} updateUser = {setUser} />
            </Route>
            <Route path="/">
                <Redirect to= {paths.PATH_LOGIN} />
            </Route>
        </Switch>
        <SnackbarProvider ref = {snackbarRef} />
      </Container>
    </Router>
  );
  
}

export {
  App
};

