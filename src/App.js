//import './App.css';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import React, { useState } from 'react';
import {
  BrowserRouter as Router, Redirect, Route, Switch
} from "react-router-dom";
import { LoginWindow } from './components/LoginWindow.js';
import { MyRecipesPage } from './components/MyRecipesPage.js';




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
  const [user, setUser] = useState(null)

  //really didnt need to use context here, but I wanted to learn it
  return (
    <Router>
      <CssBaseline />
      <Container maxWidth='md'>
        <Switch>
            <Route path="/myrecipes">
              <MyRecipesPage user = {user} /> 
            </Route>
            <Route path = "/login">
              <LoginWindow updateUser = {setUser} />
            </Route>
            <Route path="/">
                <Redirect to="/login" />
            </Route>
        </Switch>
      </Container>
    </Router>
  );
  
}

export default App;
