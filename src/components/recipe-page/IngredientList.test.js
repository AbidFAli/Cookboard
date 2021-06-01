import React from 'react';
import { cleanup, screen, render, fireEvent } from '@testing-library/react';
import {within} from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { Ingredient } from '../../Model/ingredient.js'
import { IngredientList, ERROR_MESSAGE_AMOUNT_MISSING, ERROR_MESSAGE_NAME_MISSING } from './IngredientList.js';
import { RecipePage} from './RecipePage';


//Integration tests with RecipePage and IngredientList

jest.mock('../../services/recipeService')

describe('IngredientList', () => {
    afterEach(cleanup);
    let recipe = null;
    let addHandler, updateHandler;

    function renderRecipe(recipe) {
        render(<RecipePage recipe = {recipe} prevPath = "" handleAddRecipe = {addHandler} handleUpdateRecipe = {updateHandler} />);
    }

    beforeEach(() => {
        addHandler = jest.fn()
        updateHandler = jest.fn()
    });

    describe('displays', () => {
        beforeEach(() => {
            recipe = {
                name: "waffles",
                ingredients: []
            }
        })
        test('a list of one ingredient', () => {

            recipe.ingredients =
            [
                {name: "ing1", amount: 1, unit: "tsp", id: "2001"}
            ];
            renderRecipe(recipe)
            expect(screen.getByText("ing1, 1 tsp")).toBeInTheDocument();
        });
    
        test('an ingredient without a unit', () => {
            recipe.ingredients = [{name: "egg", amount: 1, id: "2001"}];

            renderRecipe(recipe)
            expect(screen.getByText(/egg, 1/)).toBeInTheDocument();
        });
    
        test('a list of ingredients', () => {
            recipe.ingredients =
                [
                    new Ingredient("flour", 1.5, "cups"),
                    new Ingredient("baking powder", 3.5, "tsp"),
                    new Ingredient("salt", 1, "tsp"),
                ];

            renderRecipe(recipe)
            expect(screen.getByText("flour, 1.5 cups")).toBeInTheDocument;
            expect(screen.getByText("baking powder, 3.5 tsp")).toBeInTheDocument;
            expect(screen.getByText("salt, 1 tsp")).toBeinTheDocument;
        });
    })

    test('allows ingredients to be edited', () => {
        recipe = {
            name: "waffles",
            ingredients: [ {name: "egg", amount: 1, id: "2001"}]
        }
        
        renderRecipe(recipe)
        fireEvent.click(screen.getByTestId('editButton'))
        const eggTextField = screen.getByDisplayValue("egg")
        userEvent.clear(eggTextField)
        userEvent.type(eggTextField, "Butter")
        fireEvent.click(screen.getByText("Save Changes"))
        expect(screen.getByText("Butter, 1")).toBeInTheDocument()

    })

    describe('when adding ingredients', () => {
        beforeEach(() => {
            recipe = {
                name: "waffles",
                ingredients: []
            }
            renderRecipe(recipe)
            fireEvent.click(screen.getByTestId('editButton'))
            fireEvent.click(screen.getByTestId('startAddButton'))
        })

        test('succeeds for an ingredient with a name, unit, and amount', async () => {
            userEvent.type(screen.getByTestId("newNameField"), "batter")
            userEvent.clear(screen.getByTestId("newAmountField"))
            userEvent.type(screen.getByTestId("newAmountField"), "1")
            userEvent.type(screen.getByTestId("newUnitField"), "scoop")
            fireEvent.click(screen.getByText('Add ingredient'))
            fireEvent.click(screen.getByText("Save Changes"))
            expect(await screen.findByText("batter, 1 scoop")).toBeInTheDocument()
        })

        test('succeeds for an ingredient missing a unit', async () => {
            userEvent.type(screen.getByTestId("newNameField"), "batter")
            userEvent.clear(screen.getByTestId("newAmountField"))
            userEvent.type(screen.getByTestId("newAmountField"), "1")
            fireEvent.click(screen.getByText('Add ingredient'))
            fireEvent.click(screen.getByText("Save Changes"))
            expect(await screen.findByText("batter, 1")).toBeInTheDocument()
        })

        test('displays an error when the ingredient does not have a name', () => {
            userEvent.clear(screen.getByTestId("newNameField"))
            userEvent.clear(screen.getByTestId("newAmountField"))
            userEvent.type(screen.getByTestId("newAmountField"), "1")
            fireEvent.click(screen.getByText('Add ingredient'))
            expect(screen.getByText(ERROR_MESSAGE_NAME_MISSING)).toBeInTheDocument()
        })

        test('displays an error when the ingredient does not have an amount', () => {
            userEvent.clear(screen.getByTestId("newAmountField"))
            fireEvent.click(screen.getByText('Add ingredient'))
            expect(screen.getByText(ERROR_MESSAGE_AMOUNT_MISSING)).toBeInTheDocument()
        })

        test('displays an error when the amount is not a number' , () => {
            userEvent.clear(screen.getByTestId("newAmountField"))
            userEvent.type(screen.getByTestId("newAmountField"), "Hello")
            fireEvent.click(screen.getByText('Add ingredient'))
            expect(screen.getByText(ERROR_MESSAGE_AMOUNT_MISSING)).toBeInTheDocument()
        })

        test('displays an error when the amount is infinity' , () => {
            userEvent.clear(screen.getByTestId("newAmountField"))
            userEvent.type(screen.getByTestId("newAmountField"), "Infinity")
            fireEvent.click(screen.getByText('Add ingredient'))
            expect(screen.getByText(ERROR_MESSAGE_AMOUNT_MISSING)).toBeInTheDocument()
        })



    })

    test('allows ingredients to be deleted', async () => {
        let water = {name: "water", amount: 1, unit: "cup", id: "2002"}
        let batter = {name: "batter", amount: 1, unit: "cup", id: "2001"}
        recipe = {
            name : "waffles",
            ingredients: [batter, water]
        }
        addHandler = jest.fn()
        render(<RecipePage recipe = {recipe} prevPath = "" handleAddRecipe = {addHandler} />);
        fireEvent.click(screen.getByTestId('editButton'))
        const deleteButton = within(screen.getByTestId(water.id)).getByTestId('deleteIngredientButton')
        fireEvent.click(deleteButton)
        fireEvent.click(screen.getByText("Save Changes"))
        expect(screen.queryByText(/water/)).not.toBeInTheDocument()
    });

});