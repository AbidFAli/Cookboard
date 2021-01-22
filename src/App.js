import './App.css';
import React from 'react';
import { Navbar } from './components/Navbar.js';
import { RecipeWindow } from './components/RecipeWindow.js';
import { Recipe } from './Model/recipe.js';
import { Ingredient } from './Model/ingredient.js';

let testInstr = ["heat stove", "cover pan in oil", "add batter", "cook"];
let testIngredients =
    [
        new Ingredient("flour", 1.5, "cups"),
        new Ingredient("backing powder", 3.5, "tsp"),
        new Ingredient("salt", 1, "tsp"),
        new Ingredient("egg",1)
    ];


let testRecipe = new Recipe("waffles", "yummy", testInstr, testIngredients);

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
            <div className="App">
                {this.navBar}
                <RecipeWindow recipe={testRecipe} />
            </div>
        );
    }

}

export default App;
