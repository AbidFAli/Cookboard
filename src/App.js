import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import React, { useState } from 'react';
import {
  BrowserRouter as Router, Redirect, Route, Switch
} from "react-router-dom";
import './App.css';
import { AppBar } from './components/AppBar';
import { LoginWindow } from './components/LoginWindow.js';
import { MyRecipesPage } from './components/MyRecipesPage.js';
import { PATH_LOGIN, PATH_MYRECIPES } from './paths.js';




// const navTabs = [
//   { link: "/search/", name: "Search" },
//   { link: "/recipes/browse", name: "Browse Recipes" },
//   { link: "/recipes/create", name: "Create Recipes" },
//   { link: "/meals/plan", name: "Plan Meals" },
//   { link: "/pantry/", name: "My Pantry" },
//   { link: "/grocerylist/", name: "Grocery List" },
//   { link: "/favs/", name: "Favorites" }
// ]; 


const App = ({basePath}) =>  {
  const [user, setUser] = useState(undefined)
  let appBar = (
    <React.Fragment>
      <AppBar user = {user} clearUser = {() => setUser(undefined)} />
      <Toolbar />
    </React.Fragment>
    
  )
  return (
    <Router>
      <CssBaseline />
      <Container maxWidth='md'>
        {appBar}
        <Switch>  
            <Route path={PATH_MYRECIPES}>
              <MyRecipesPage user = {user} /> 
            </Route>
            <Route path = {PATH_LOGIN}>
              <LoginWindow user = {user} updateUser = {setUser} />
            </Route>
            <Route path="/">
                <Redirect to= {PATH_LOGIN} />
            </Route>
        </Switch>
      </Container>
    </Router>
  );
  
}

export {
  App
};

