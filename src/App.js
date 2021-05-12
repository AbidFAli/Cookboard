//import './App.css';
import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { Navbar } from './components/Navbar.js';
import { MyRecipesPage} from './components/MyRecipesPage.js'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";





class App extends React.Component {
  static navTabs = [
    { link: "/search/", name: "Search" },
    { link: "/recipes/browse", name: "Browse Recipes" },
    { link: "/recipes/create", name: "Create Recipes" },
    { link: "/meals/plan", name: "Plan Meals" },
    { link: "/pantry/", name: "My Pantry" },
    { link: "/grocerylist/", name: "Grocery List" },
    { link: "/favs/", name: "Favorites" }
  ]; 

  constructor(props) {
      super(props);
      this.navBar = <Navbar links={App.navTabs} />;
  }

  render() { 
      return (
        <Router>
          <CssBaseline />
          <Container maxWidth='md'>
            <Switch>
              <Route path="/myrecipes">
                <MyRecipesPage />
                </Route>
                <Route path="/">
                  <Redirect to="/myrecipes" />
              </Route>
            </Switch>
          </Container>
        </Router>
      );
  }

}

export default App;
