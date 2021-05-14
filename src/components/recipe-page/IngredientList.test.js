import React from 'react';
import { cleanup, screen, render, fireEvent } from '@testing-library/react';
import {within} from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { Ingredient } from '../../Model/ingredient.js'
import { IngredientList } from './IngredientList.js';
import { RecipePage} from './RecipePage';


//Integration tests with RecipePage and IngredientList

describe('IngredientList', () => {
    afterEach(cleanup);
    let recipe = null;
    let addHandler = null;
    describe('displays', () => {
        beforeEach(() => {
            recipe = {
                name: "waffles",
                ingredients: []
            }
            addHandler = jest.fn()
        })
        test('a list of one ingredient', () => {
            recipe.ingredients =
            [
                {name: "ing1", amount: 1, unit: "tsp", id: "2001"}
            ];
            render(<RecipePage recipe = {recipe} prevPath = "" handleAddRecipe = {addHandler} />);
            expect(screen.getByText("ing1, 1 tsp")).toBeInTheDocument();
        });
    
        test('displays an ingredient without a unit', () => {
            recipe.ingredients = [{name: "egg", amount: 1, id: "2001"}];

            render(<RecipePage recipe = {recipe} prevPath = "" handleAddRecipe = {addHandler} />);
            expect(screen.getByText(/egg, 1/)).toBeInTheDocument();
        });
    
        test('displays a list of ingredients', () => {
            recipe.ingredients =
                [
                    new Ingredient("flour", 1.5, "cups"),
                    new Ingredient("baking powder", 3.5, "tsp"),
                    new Ingredient("salt", 1, "tsp"),
                ];

            render(<RecipePage recipe = {recipe} prevPath = "" handleAddRecipe = {addHandler} />);
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
        addHandler = jest.fn()
        render(<RecipePage recipe = {recipe} prevPath = "" handleAddRecipe = {addHandler} />);

        fireEvent.click(screen.getByTestId('editButton'))
        const eggTextField = screen.getByDisplayValue("egg")
        userEvent.clear(eggTextField)
        userEvent.type(eggTextField, "Butter")
        fireEvent.click(screen.getByText("Save Changes"))
        expect(screen.getByText("Butter, 1")).toBeInTheDocument()

    })

    test('allows ingredients to be added', async () => {
        recipe = {
            name: "waffles",
            ingredients: []
        }
        addHandler = jest.fn()
        render(<RecipePage recipe = {recipe} prevPath = "" handleAddRecipe = {addHandler} />);
        fireEvent.click(screen.getByTestId('editButton'))
        fireEvent.click(screen.getByTestId('startAddButton'))
        userEvent.type(screen.getByTestId("newNameField"), "batter")
        userEvent.clear(screen.getByTestId("newAmountField"))
        userEvent.type(screen.getByTestId("newAmountField"), "1")
        userEvent.type(screen.getByTestId("newUnitField"), "scoop")
        fireEvent.click(screen.getByText('Add ingredient'))
        fireEvent.click(screen.getByText("Save Changes"))
        expect(await screen.findByText("batter, 1 scoop")).toBeInTheDocument()
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