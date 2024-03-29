import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { Recipe } from '../Model/recipe.js';
import { RecipeList } from './RecipeList';


jest.mock('../services/recipeService')


describe("RecipeList Tests", () => {
    afterEach(cleanup);

    let testRecipes;

    const renderList = (recipes) => {
        render(
            <RecipeList recipes={recipes} path={"/myrecipes"} messageNoContent = {""} />
        );
    }

    test("renders a list of 1 recipe", () => {
        testRecipes = [new Recipe("pancakes")]
        renderList(testRecipes)
        expect(screen.getByText("pancakes")).toBeInTheDocument()
    })

    test("renders a list of recipes", () => {
        testRecipes = [
            new Recipe("pancakes"),
            new Recipe("pizza"),
            new Recipe("quesadillas"),
            new Recipe("spaghetti"),
            new Recipe("keema")
        ];
        renderList(testRecipes)

        for (let recipe of testRecipes) {
            expect(screen.getByText(recipe.name)).toBeInTheDocument();
        }
    });

});