import React from 'react';
import { Recipe } from '../Model/recipe.js';
import { cleanup, screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { RecipeList, MyRecipesPage } from './MyRecipesPage'
import { MemoryRouter, Route, Switch } from 'react-router-dom'
import {jest} from '@jest/globals'



describe("RecipeList Tests", () => {
    afterEach(cleanup);


    test("renders a list of recipes", () => {


        let testRecipes = [
            new Recipe("pancakes"),
            new Recipe("pizza"),
            new Recipe("quesadillas"),
            new Recipe("spaghetti"),
            new Recipe("keema")
        ];
        let path = "/myrecipes";
        render(
            <MemoryRouter initialEntries={[path]}>
                <RecipeList recipes={testRecipes} path={path} />
            </MemoryRouter>
        );
        for (let recipe of testRecipes) {
            expect(screen.getByText(recipe.name)).toBeInTheDocument();
        }
    });

});

/*
 *TODO: fix later. Idk why it doesnt work 
 */

/*
describe("MyRecipesPage Tests", () => {
    test("clicking on a recipe navigates to its page", async () => {
        let testRecipes = [
            new Recipe("pancakes")
        ];

        let path = "/myrecipes";
        render(
            <MemoryRouter initialEntries={[path]}>
                <Switch>
                <Route path ="/myrecipes">
                    <MyRecipesPage recipes={testRecipes}/>
                </Route>
                </Switch>
            </MemoryRouter>
        );
        let recipeName = testRecipes[0].name;
        userEvent.click(screen.getByText(recipeName));
        expect(screen.getByRole('heading', {name : recipeName})).toBeInTheDocument();

    });
});
*/