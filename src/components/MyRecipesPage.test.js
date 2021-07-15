import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { Recipe } from '../Model/recipe.js';
import { MESSAGE_NO_RECIPES, MyRecipesPage, RecipeList } from './MyRecipesPage';



describe("RecipeList Tests", () => {
    afterEach(cleanup);

    let testRecipes;

    const renderList = (recipes) => {
        render(
            <RecipeList recipes={recipes} path={"/myrecipes"} />
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



const renderPage = (user) => {
    render (
    <MemoryRouter initialEntries = {["/myrecipes"]} initialIndex = {0}>
        <Route path = "/myrecipes">
            <MyRecipesPage user = {user} />
        </Route>
    </MemoryRouter>
    )
}

//jest.mock('../../services/recipeService')
//either mock recipeService or axios get/post requests

describe("MyRecipesPage", () => {
    let user;

    afterEach(cleanup);
    
    beforeEach(() => {
        user = {
            username: "Bob",
            email: "bob@bob.com",
            token: "1234",
            recipes: [
                new Recipe("Waffles"),
                new Recipe("Spaghetti"),
                new Recipe("Baked Potatoes")
            ]
        }
    })

    //React Router docs says testing navigation not that important
    //unsure whether to delete this, so just gonna comment it out.
    
    // test("clicking on a recipe navigates to its page", async () => {

    //     let path = "/myrecipes";
    //     render(
    //         <MemoryRouter initialEntries={[path]} initialIndex = {0}>
    //             <Route path ="/myrecipes">
    //                 <MyRecipesPage recipes={testRecipes}/>
    //             </Route>
    //         </MemoryRouter>
    //     );
    //     let recipeName = testRecipes[0].name;
    //     userEvent.click(screen.getByText(recipeName));
    //     expect(screen.getByRole('heading', {name : recipeName})).toBeInTheDocument();
    // });

    
    test('displays a message when the user has no recipes', () => {
        let user2 = {
            username: "test",
            recipes: []
        }
        renderPage(user2)
        expect(screen.getByText(MESSAGE_NO_RECIPES)).toBeInTheDocument()
    })
    
    test('displays the recipes for a user with recipes', () => {
        renderPage(user)
        user.recipes.forEach((recipe) => {
            expect(screen.getByText(recipe.name)).toBeInTheDocument()
        })
        
    })

});
