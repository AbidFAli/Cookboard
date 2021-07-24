import { act, cleanup, render, screen } from '@testing-library/react';
import axios from 'axios';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { Recipe } from '../Model/recipe.js';
import { MESSAGE_NO_RECIPES, MyRecipesPage, RecipeList } from './MyRecipesPage';

jest.mock('axios')


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



const renderPage = async (user) => {
    await act(async () => {
        render (
            <MemoryRouter initialEntries = {["/myrecipes"]} initialIndex = {0}>
                <Route path = "/myrecipes">
                    <MyRecipesPage user = {user} />
                </Route>
            </MemoryRouter>
            )
    });
}

//jest.mock('../../services/recipeService')
//either mock recipeService or axios get/post requests

describe("MyRecipesPage", () => {
    let user;
    let recipes;

    afterEach(() => {
        cleanup;
        axios.get.mockRestore()
    });
    
    beforeEach(() => {
        recipes = [
            new Recipe("Waffles"),
            new Recipe("Spaghetti"),
            new Recipe("Baked Potatoes")
        ]
        user = {
            username: "Bob",
            email: "bob@bob.com",
            token: "1234",
            recipes: recipes.map(recipe => { return {id: recipe.id, name: recipe.name} })
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

    
    test('displays a message when the user has no recipes', async () => {
        let user2 = {
            username: "test",
            recipes: []
        }

        axios.get.mockResolvedValueOnce({
            data: {
                recipes: user2.recipes
            }
        })
        
        await renderPage(user2)
        expect(screen.getByText(MESSAGE_NO_RECIPES)).toBeInTheDocument()
    })
    
    test('displays the recipes for a user with recipes', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                recipes: user.recipes
            }
        })
        await renderPage(user)
        
        
        for( let recipe of user.recipes){
            let recipeName = await screen.findByText(recipe.name)
            expect(recipeName).toBeInTheDocument()
        }
    })

});
