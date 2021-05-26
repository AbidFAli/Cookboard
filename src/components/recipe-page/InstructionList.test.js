import React from 'react';
import { cleanup, screen, render, prettyDOM } from '@testing-library/react';
import {fireEvent, within} from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { Recipe } from '../../Model/recipe.js';
import { ERROR_BLANK_INSTRUCTION } from './InstructionList';
import { RecipePage} from './RecipePage';

//Integration tests with RecipePage and InstructionList

jest.mock('../../services/recipeService')

describe('InstructionList', () => {
  afterEach(cleanup);
  let addHandler, updateHandler;

  beforeEach(() => {
    addHandler = jest.fn();
    updateHandler = jest.fn()
  })

  function renderRecipe(recipe) {
    render(<RecipePage recipe = {recipe} prevPath = "" handleAddRecipe = {addHandler} handleUpdateRecipe = {updateHandler} />);
  }

  test('displays a list of instructions', () => {
      let testInstr = ["heat stove", "cover pan in oil", "add batter"];
      
      let recipe = {
        name: "something",
        instructions: testInstr
      }
      renderRecipe(recipe)
      testInstr.forEach((value, index) => {
          expect(screen.getByText(Recipe.printInstruction(value,index))).toBeInTheDocument();
      });
  });

 describe('when adding instructions,', () => {
   let recipe
   beforeEach(() => {
    recipe = {
      name: "waffles"
    }
   });

   test('adding succeeds for a recipe with no instructions', async () => {
     renderRecipe(recipe)
     fireEvent.click(screen.getByTestId('editButton'))
     fireEvent.click(screen.getByTestId('addingInstructionButton'))
     userEvent.type(screen.getByTestId("newInstructionField"), "turn on stove")
     fireEvent.click(screen.getByText(/Add instruction/i))
     fireEvent.click(screen.getByText("Save Changes"))
     expect(await screen.findByText("1. turn on stove")).toBeInTheDocument();
   })

   test('adding succeeds for a recipe with some instructions', async () => {
    recipe.instructions = ['step one', 'step two']
    renderRecipe(recipe)
    fireEvent.click(screen.getByTestId('editButton'))
    fireEvent.click(screen.getByTestId('addingInstructionButton'))
    let newInstruction = "step three"
    userEvent.type(screen.getByTestId("newInstructionField"), newInstruction)
    fireEvent.click(screen.getByText(/Add instruction/i))
    fireEvent.click(screen.getByText("Save Changes"))
    expect(await screen.findByText(`3. ${newInstruction}`)).toBeInTheDocument();
   })

   test.only('does not allow blank instructions to be added' , () => {
     renderRecipe(recipe)
     fireEvent.click(screen.getByTestId('editButton'))
     fireEvent.click(screen.getByTestId('addingInstructionButton'))
     userEvent.clear(screen.getByTestId("newInstructionField"))
     fireEvent.click(screen.getByText(/Add instruction/i))
     expect(screen.getByText(ERROR_BLANK_INSTRUCTION)).toBeInTheDocument()
   })

 })
 
 describe('instructions can be edited', () => {
  let recipe
  beforeEach(() => {
   recipe = {
     name: "waffles",
     instructions: ['step one', 'step two', 'step three']
   }
   renderRecipe(recipe)
   fireEvent.click(screen.getByTestId('editButton'))
  });

   test('one instruction can be edited', async () => {

    let editedField = screen.getByDisplayValue(/step two/i)
    userEvent.clear(editedField)
    userEvent.type(editedField, 'step 2')
    fireEvent.click(screen.getByText("Save Changes"))
    expect(await screen.findByText(/step 2/i)).toBeInTheDocument();
   })

   test('multiple instructions can be edited', async () => {
    let editedField = screen.getByDisplayValue(/step two/i)
    userEvent.clear(editedField)
    userEvent.type(editedField, 'step 2')
    editedField = screen.getByDisplayValue(/step three/i)
    userEvent.clear(editedField)
    userEvent.type(editedField, 'step 3')
    fireEvent.click(screen.getByText("Save Changes"))
    expect(await screen.findByText(/step 2/i)).toBeInTheDocument();
    expect(await screen.findByText(/step 3/i)).toBeInTheDocument();
   })
 })

 describe('instructions can be removed', () => {
  let recipe
  beforeEach(() => {
   recipe = {
     name: "waffles",
     instructions: ['step one', 'step two', 'step three']
   }
   render(<RecipePage recipe = {recipe} prevPath = "" handleAddRecipe = {addHandler} handleUpdateRecipe = {updateHandler} />);
   fireEvent.click(screen.getByTestId('editButton'))
  });

  function removeInstruction(instruction){
    let deleteButton = within(instruction).getByRole('button')
    fireEvent.click(deleteButton)
  }

  function getInstructions(){
    return within(screen.getByTestId("instructionList")).queryAllByRole("listitem")
  }

  test('the first instruction can be removed', ()=> {
    let listItems = getInstructions()
    removeInstruction(listItems[0])
    fireEvent.click(screen.getByText("Save Changes"))
    expect(screen.queryByText(/step one/i)).toBeNull()
   })
  
  test('the third instruction can be removed' , () => {
    let listItems = getInstructions()
    removeInstruction(listItems[2])
    fireEvent.click(screen.getByText("Save Changes"))
    expect(screen.queryByText(/step three/i)).toBeNull()
    expect(getInstructions()).toHaveLength(2)
  });

  test('all instructions can be removed', () => {
    for(let i = 0; i < recipe.instructions.length ; i++){
      let listItems = getInstructions()
      removeInstruction(listItems[0])
    }
    fireEvent.click(screen.getByText("Save Changes"))
    expect(getInstructions()).toHaveLength(0)
  })

 })

});