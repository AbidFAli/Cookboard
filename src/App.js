//import './App.css';
import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { Navbar } from './components/Navbar.js';
import { RecipePage } from './components/RecipePage.js';
import { MyRecipesPage} from './components/MyRecipesPage.js'
import { Recipe } from './Model/recipe.js';
import { Ingredient } from './Model/ingredient.js';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";


let testInstr = ["heat stove", "cover pan in oil", "add batter", "cook"];
let testIngredients =
    [
        new Ingredient("flour", 1.5, "cups"),
        new Ingredient("backing powder", 3.5, "tsp"),
        new Ingredient("salt", 1, "tsp"),
        new Ingredient("egg",1)
    ];


let testRecipe = new Recipe("waffles",3001, "yummy", testInstr, testIngredients);
testRecipe.setServingInfo({
    numServed: 3,
    yield: 10,
    servingSize: 1,
    servingUnit: "waffle" 
});
testRecipe.stars = 4;
testRecipe.timeToMake = 20;
testRecipe.timeToMakeUnit = "minutes";

let testRecipeList = [
    testRecipe,
    new Recipe("pancakes", 2001),
    new Recipe("pizza", 2002),
    new Recipe("quesadillas", 2003),
    new Recipe("spaghetti", 2004),
    new Recipe("keema", 2005)
];


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

    //
    //<RecipePage recipe={testRecipe} />

    render() { 
        return (
            <Router>
                <CssBaseline />
                <Container maxWidth='md'>
                    <Switch>
                        <Route path="/myrecipes">
                            <MyRecipesPage recipes={testRecipeList} />
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
