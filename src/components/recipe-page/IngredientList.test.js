import { within } from '@testing-library/dom';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Ingredient } from '../../Model/ingredient.js';
import userFixture from '../../test/fixtures/user/userNoRecipes';
import testHelper from '../../test/util/recipePageTestHelper';
import {
    ERROR_MESSAGE_AMOUNT_MISSING,
    ERROR_MESSAGE_AMOUNT_NAN,
    ERROR_MESSAGE_NAME_MISSING, ID_BUTTON_ADD_INGREDIENT, ID_DELETE_INGREDIENT_BUTTON, IngredientList
} from './IngredientList.js';
import { ID_EDIT_BUTTON } from './RecipePage';






//Integration tests with RecipePage and IngredientList

jest.mock('../../services/recipeService')


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

const getNthIngredientField = (labelText, n) => {
    let fields = screen.queryAllByLabelText(labelText)
    return fields[n]
}

const renderIngredientList = (ingredients) => {
    render(
        <IngredientList
            ingredients = {ingredients}
            editable = {false}
            handleAdd = {jest.fn()}
            handleRemove = {jest.fn()}
            handleEdit = {jest.fn()}
            dispatchErrors = {jest.fn()}
        />
    )
}

const testDelete = (ingredient) => {
    const deleteButton = within(screen.getByTestId(ingredient.id)).getByTestId(ID_DELETE_INGREDIENT_BUTTON)
    fireEvent.click(deleteButton)
    expect(screen.queryByText(ingredient.name)).not.toBeInTheDocument()
}

const checkForAllErrors = () => {
    let errorMessages = [ERROR_MESSAGE_AMOUNT_MISSING, ERROR_MESSAGE_AMOUNT_NAN, ERROR_MESSAGE_NAME_MISSING]
    errorMessages.forEach((message) => {
        expect(screen.queryByText(message)).toBeNull()
    })
}

//Integration tests with RecipePage and IngredientList
describe('IngredientList unit tests', () => {
    
    describe('displays', () => {
        let ingredients
        beforeEach(() => {
            ingredients = []
        })  
        test('a list of one ingredient', () => {

            ingredients =
            [
                new Ingredient("ing1", 1, "tsp")
            ];
            renderIngredientList(ingredients)
            expect(screen.getByText("ing1, 1 tsp")).toBeInTheDocument();
        });
    
        test('an ingredient without a unit', () => {
            ingredients = [new Ingredient("egg", 1)];
            renderIngredientList(ingredients)
            expect(screen.getByText(/egg, 1/)).toBeInTheDocument();
        });
    
        test('a list of ingredients', () => {
            ingredients =
                [
                    new Ingredient("flour", 1.5, "cups"),
                    new Ingredient("baking powder", 3.5, "tsp"),
                    new Ingredient("salt", 1, "tsp"),
                ];
            renderIngredientList(ingredients)
            expect(screen.getByText("flour, 1.5 cups")).toBeInTheDocument();
            expect(screen.getByText("baking powder, 3.5 tsp")).toBeInTheDocument();
            expect(screen.getByText("salt, 1 tsp")).toBeInTheDocument();
        });
    })
})


describe('IngredientList integration tests within RecipePage', () => {
    afterEach(cleanup);

    beforeEach(() => {
        jest.useFakeTimers()
        jest.clearAllMocks()
    })
    
    afterAll(() => {
        jest.useRealTimers()
    })

    let recipe = null;
    
    
    describe('when editing ingredients', () => {
        beforeEach(async ()=> {
            let user = userFixture()
            recipe = {
                name: "waffles",
                ingredients: [ {name: "egg", amount: 1, id: "2001"}],
                id: "1234",
                user: user.id
            }

            await testHelper.setupAndRenderRecipe(recipe, user)
            testHelper.clickEdit()
        })

        
        test('allows one ingredient to be edited', () => {
            
            const eggTextField = screen.getByDisplayValue("egg")
            userEvent.clear(eggTextField)
            userEvent.type(eggTextField, "Butter")
            expect(screen.getByDisplayValue("Butter")).toBeInTheDocument()
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

        test('disables create recipe button if there is an error in an ingredient', () => {
            let amountField = screen.getByLabelText("Amount")
            userEvent.clear(amountField)
            testHelper.expectSaveButtonDisabled()
        })

        test('create recipe button should be enabled if there are no errors in the ingredient', () => {
            testHelper.expectSaveButtonEnabled()
        })

        //getting test wrapped in act errors
        test('errors are reset and create button is enabled after causing an error, canceling edits, and then editing again', async () => {
            let amountField = screen.getByLabelText("Amount")
            userEvent.clear(amountField)
            expect(screen.getByText(ERROR_MESSAGE_AMOUNT_MISSING)).toBeInTheDocument()
            testHelper.clickCancel()
            //wait for edit to show up
            await waitFor(() => expect(screen.getByTestId(ID_EDIT_BUTTON)).toBeInTheDocument())
            testHelper.clickEdit()
            expect(screen.queryByText(ERROR_MESSAGE_AMOUNT_MISSING)).toBeNull()
            testHelper.expectSaveButtonEnabled()
        })

    });


    describe('when adding ingredients', () => {
        beforeEach(async () => {
            let user = userFixture()
            recipe = {
                name: "waffles",
                ingredients: [],
                id: "12345",
                user: user.id
            }
            await testHelper.setupAndRenderRecipe(recipe, user)
            fireEvent.click(screen.getByTestId(ID_EDIT_BUTTON))
        })


        test('shows no errors when adding an ingredient with a name, unit, and amount', async () => {
            performAdd("batter", "1", "scoop")
            checkForAllErrors()
        })

        test('shows no errors when adding an ingredient missing a unit', async () => {
            performAdd("batter", "1")
            checkForAllErrors()
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



    describe('when deleting ingredients', ()=> {
        beforeEach(async () => {
            let user = userFixture()
            recipe = {
                name : "waffles",
                ingredients: [
                    {name: "water", amount: 1, unit: "cup", id: "2002"},
                    {name: "batter", amount: 1, unit: "cup", id: "2001"},
                    {name: "pancake mix", amount: 2, unit: "cup", id: "4041"}
                ],
                id: "1234",
                user: user.id
            }
            
            await testHelper.setupAndRenderRecipe(recipe, user)
            fireEvent.click(screen.getByTestId(ID_EDIT_BUTTON))
        });

        test('allows ingredients to be deleted', async () => {
            testDelete(recipe.ingredients[0])
        });

        test('allows multiple ingredients to be deleted', ()=> {
            recipe.ingredients.forEach((ingredient) => {
                testDelete(ingredient)
            })
        })

        test('when deleting an ingredient that has an error, the save button is re-enabled', () => {
            userEvent.clear(getNthIngredientField("Amount", 0))
            testHelper.expectSaveButtonDisabled()
            testDelete(recipe.ingredients[0])
            testHelper.expectSaveButtonEnabled()
        })
    })

    
});