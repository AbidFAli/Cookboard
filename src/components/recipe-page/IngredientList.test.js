import React from 'react';
import { cleanup, screen, render, fireEvent } from '@testing-library/react';
import {within} from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { Ingredient } from '../../Model/ingredient.js'
import { 
    IngredientList, 
    ERROR_MESSAGE_AMOUNT_MISSING,
    ERROR_MESSAGE_AMOUNT_NAN, 
    ERROR_MESSAGE_NAME_MISSING,
    ID_DELETE_INGREDIENT_BUTTON,
    ID_BUTTON_ADD_INGREDIENT
} from './IngredientList.js';
import { RecipePage, ID_EDIT_BUTTON} from './RecipePage';


//Integration tests with RecipePage and IngredientList

jest.mock('../../services/recipeService')

describe('IngredientList', () => {
    afterEach(cleanup);
    let recipe = null;
    

    function renderRecipe(recipe) {
        let addHandler = jest.fn();
        let updateHandler = jest.fn();
        render(<RecipePage recipe = {recipe} prevPath = "" handleAddRecipe = {addHandler} handleUpdateRecipe = {updateHandler} />);
    }

    const getNthIngredientField = (labelText, n) => {
        let fields = screen.queryAllByLabelText(labelText)
        return fields[n]
    }
    /*
     *name: str,
     *amount: str,
     *unit: str
     */
    const performAdd = (name, amount, unit) => {
        fireEvent.click(screen.getByTestId(ID_BUTTON_ADD_INGREDIENT))
        let nameFields = screen.queryAllByLabelText("Name")
        let amountFields = screen.queryAllByLabelText("Amount")
        let unitFields = screen.queryAllByLabelText("Unit")
        //fields[field.length - 1] is the last aka newly added field
        userEvent.type(nameFields[nameFields.length - 1], name)
        userEvent.clear(amountFields[amountFields.length - 1])
        userEvent.type(amountFields[amountFields.length - 1], amount)
        if(unit){
            userEvent.type(unitFields[unitFields.length - 1], unit)
        }
    }


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
            expect(screen.getByText("flour, 1.5 cups")).toBeInTheDocument();
            expect(screen.getByText("baking powder, 3.5 tsp")).toBeInTheDocument();
            expect(screen.getByText("salt, 1 tsp")).toBeInTheDocument();
        });
    })

    describe('when editing ingredients', () => {
        beforeEach(()=> {
            recipe = {
                name: "waffles",
                ingredients: [ {name: "egg", amount: 1, id: "2001"}]
            }

            renderRecipe(recipe)
            fireEvent.click(screen.getByTestId(ID_EDIT_BUTTON))
        })

        
        test('allows one ingredient to be edited', async () => {
            
            const eggTextField = screen.getByDisplayValue("egg")
            userEvent.clear(eggTextField)
            userEvent.type(eggTextField, "Butter")
            fireEvent.click(screen.getByText("Save Changes"))
            expect( await screen.findByText("Butter, 1")).toBeInTheDocument()
        })

        test('shows an error message if an ingredients name is blank', () => {
            const eggTextField = screen.getByDisplayValue("egg")
            userEvent.clear(eggTextField)
            expect(screen.getByText(ERROR_MESSAGE_NAME_MISSING)).toBeInTheDocument()
        })


        test('shows an error message if an ingredients amount is empty' ,() => {
            let amountField = screen.getByLabelText("Amount")
            userEvent.clear(amountField)
            expect(screen.getByText(ERROR_MESSAGE_AMOUNT_MISSING)).toBeInTheDocument()
        })

        test('shows an error message if an ingredients amount is 0', () => {
            let amountField = screen.getByLabelText("Amount")
            userEvent.clear(amountField)
            userEvent.type(amountField, 0)
            expect(screen.getByText(ERROR_MESSAGE_AMOUNT_MISSING)).toBeInTheDocument()
        })

        test('shows an error message if an ingredients amount is not a number', () => {
            let amountField = screen.getByLabelText("Amount")
            userEvent.type(amountField, 'something')
            expect(screen.getByText(ERROR_MESSAGE_AMOUNT_NAN)).toBeInTheDocument()
        })

    });


    describe('when adding ingredients', () => {
        beforeEach(() => {
            recipe = {
                name: "waffles",
                ingredients: []
            }
            renderRecipe(recipe)
            fireEvent.click(screen.getByTestId(ID_EDIT_BUTTON))
        })



        test('succeeds for an ingredient with a name, unit, and amount', async () => {
            performAdd("batter", "1", "scoop")
            fireEvent.click(screen.getByText("Save Changes"))
            expect(await screen.findByText("batter, 1 scoop")).toBeInTheDocument()
        })

        test('succeeds for an ingredient missing a unit', async () => {
            performAdd("batter", "1")
            fireEvent.click(screen.getByText("Save Changes"))
            expect(await screen.findByText("batter, 1")).toBeInTheDocument()
        })

        test('displays an error when the ingredient does not have a name', () => {
            fireEvent.click(screen.getByTestId(ID_BUTTON_ADD_INGREDIENT))
            userEvent.clear(getNthIngredientField("Name", 0))
            let newAmountField = getNthIngredientField("Amount", 0)
            userEvent.clear(newAmountField)
            userEvent.type(newAmountField, "1")
            expect(screen.getByText(ERROR_MESSAGE_NAME_MISSING)).toBeInTheDocument()
        })

        test('displays an error when the ingredient does not have an amount', () => {
            fireEvent.click(screen.getByTestId(ID_BUTTON_ADD_INGREDIENT))
            userEvent.clear(getNthIngredientField("Amount", 0))
            expect(screen.getByText(ERROR_MESSAGE_AMOUNT_MISSING)).toBeInTheDocument()
        })

        test('displays an error when the amount is not a number' , () => {
            fireEvent.click(screen.getByTestId(ID_BUTTON_ADD_INGREDIENT))
            userEvent.clear(getNthIngredientField("Amount", 0))
            userEvent.type(getNthIngredientField("Amount", 0), "Hello")
            expect(screen.getByText(ERROR_MESSAGE_AMOUNT_NAN)).toBeInTheDocument()
        })

        test('displays an error when the amount is infinity' , () => {
            fireEvent.click(screen.getByTestId(ID_BUTTON_ADD_INGREDIENT))
            userEvent.clear(getNthIngredientField("Amount", 0))
            userEvent.type(getNthIngredientField("Amount", 0), "Infinity")
            expect(screen.getByText(ERROR_MESSAGE_AMOUNT_NAN)).toBeInTheDocument()
        })

        test('after adding two ingredients, clicking delete on the first only deletes that ingredient', () => {
            performAdd("batter", "1", "scoop")
            performAdd("mix", ".5", "cups")
            userEvent.click(screen.getAllByTestId(ID_DELETE_INGREDIENT_BUTTON)[0])
            expect(screen.queryByText("batter")).not.toBeInTheDocument()
        })

    })

    test('allows ingredients to be deleted', () => {
        let water = {name: "water", amount: 1, unit: "cup", id: "2002"}
        let batter = {name: "batter", amount: 1, unit: "cup", id: "2001"}
        recipe = {
            name : "waffles",
            ingredients: [batter, water]
        }
        renderRecipe(recipe);
        fireEvent.click(screen.getByTestId(ID_EDIT_BUTTON))
        const deleteButton = within(screen.getByTestId(water.id)).getByTestId(ID_DELETE_INGREDIENT_BUTTON)
        fireEvent.click(deleteButton)
        expect(screen.queryByText(/water/)).not.toBeInTheDocument()
    });

    

});