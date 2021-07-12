import { fireEvent, within } from '@testing-library/dom';
import { cleanup, prettyDOM, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Instruction from '../../Model/instruction.js';
import { Recipe } from '../../Model/recipe.js';
import userFixture from '../../test/fixtures/user/userNoRecipes';
import testHelper from '../../test/util/recipePageTestHelper';
import { ERROR_BLANK_INSTRUCTION, ID_INSTRUCTION_LIST, InstructionList } from './InstructionList';
import { ID_EDIT_BUTTON } from './RecipePage';


//Integration tests with RecipePage and InstructionList

jest.mock('axios')



const removeInstruction = (instruction) => {
  let deleteButton = within(instruction).getByRole('button')
  fireEvent.click(deleteButton)
}

const getInstructions = () => {
  return within(screen.getByTestId(ID_INSTRUCTION_LIST)).queryAllByRole("listitem")
}

const printToConsole = () => {
  console.log(prettyDOM(screen.getByTestId(ID_INSTRUCTION_LIST)))
}


describe('InstructionList Unit Tests', () => {
  afterEach(cleanup);

  const renderInstructionList = (instructions, editable) => {
    render(
      <InstructionList
        instructions = {instructions}
        editable = {editable}
        handleAdd = {jest.fn()}
        handleRemove = {jest.fn()}
        handleEdit = {jest.fn()}
      />
    )
  }
  

  test('displays a list of Instructions', () => {
      let testInstr = [
        new Instruction("heat stove"),
        new Instruction("cover pan in oil"),
        new Instruction("add batter")
      ];

      renderInstructionList(testInstr, false)

      testInstr.forEach((instr, index) => {
          expect(screen.getByText(Recipe.printInstruction(instr.text,index))).toBeInTheDocument();
      });
  });

});
 
describe('Tests for InstructionList integration with RecipePage', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.useRealTimers()
  })



 describe('when adding instructions,', () => {
   let recipe
   beforeEach(() => {
    recipe = {
      name: "waffles",
      id : "1234",
      instructions: [],
      description: 'hacky'
    }
   });

   test('adding succeeds for a recipe with no instructions', async () => {
     await testHelper.setupAndRenderRecipe(recipe, userFixture())
     fireEvent.click(screen.getByTestId(ID_EDIT_BUTTON))
     fireEvent.click(screen.getByTestId('addingInstructionButton'))
     userEvent.type(screen.getByTestId("newInstructionField"), "turn on stove")
     fireEvent.click(screen.getByText(/Add instruction/i))

     let result = await screen.findByDisplayValue("turn on stove")
     expect(result).toBeInTheDocument();
   })

   
   test('adding succeeds for a recipe with some instructions', async () => {
    recipe.instructions = ['step one', 'step two']
    await testHelper.setupAndRenderRecipe(recipe, userFixture())

    fireEvent.click(screen.getByTestId(ID_EDIT_BUTTON))
    fireEvent.click(screen.getByTestId('addingInstructionButton'))
    let newInstruction = "step three"
    userEvent.type(screen.getByTestId("newInstructionField"), newInstruction)
    fireEvent.click(screen.getByText(/Add instruction/i))
    expect(await screen.findByDisplayValue(newInstruction)).toBeInTheDocument();
   })

   test('does not allow blank instructions to be added' , async () => {
     await testHelper.setupAndRenderRecipe(recipe, userFixture())
     fireEvent.click(screen.getByTestId(ID_EDIT_BUTTON))
     fireEvent.click(screen.getByTestId('addingInstructionButton'))
     userEvent.clear(screen.getByTestId("newInstructionField"))
     fireEvent.click(screen.getByText(/Add instruction/i))
     expect(screen.getByText(ERROR_BLANK_INSTRUCTION)).toBeInTheDocument()
   })

 })
 
 describe('instructions can be edited', () => {
  let recipe
  beforeEach( async () => {
   recipe = {
     name: "waffles",
     instructions: ['step one', 'step two', 'step three'],
     id : "12345"
   }
   await testHelper.setupAndRenderRecipe(recipe, userFixture())
   fireEvent.click(screen.getByTestId(ID_EDIT_BUTTON))
  });

   test('one instruction can be edited', async () => {
    let editedField =  await screen.findByDisplayValue(/step two/i)
    userEvent.clear(editedField)
    userEvent.type(editedField, 'step 2')
    
    expect(screen.getByDisplayValue(/step 2/i)).toBeInTheDocument();
   })

   test('multiple instructions can be edited',() => {
    let editedField = screen.getByDisplayValue(/step two/i)
    userEvent.clear(editedField)
    userEvent.type(editedField, 'step 2 changed')
    editedField = screen.getByDisplayValue(/step three/i)
    userEvent.clear(editedField)
    userEvent.type(editedField, 'step 3 changed')
    expect(screen.getByDisplayValue(/step 2 changed/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/step 3 changed/i)).toBeInTheDocument();
   })

   test('an error message is displayed if an instructions name is cleared', () => {
    let editedField = screen.getByDisplayValue(/step two/i)
    userEvent.clear(editedField)
    expect(screen.getByText(ERROR_BLANK_INSTRUCTION)).toBeInTheDocument()
   })
 })

 describe('instructions can be removed', () => {
  let recipe
  beforeEach(async () => {
   recipe = {
     name: "waffles",
     instructions: ['step one', 'step two', 'step three'],
     id: "1234"
   }
   await testHelper.setupAndRenderRecipe(recipe, userFixture())
   fireEvent.click(screen.getByTestId(ID_EDIT_BUTTON))
  });



  test('the first instruction can be removed', ()=> {
    let listItems = getInstructions()
    removeInstruction(listItems[0])
    expect(screen.queryByText(/step one/i)).toBeNull()
   })
  
  test('the third instruction can be removed' , () => {
    let listItems = getInstructions()
    removeInstruction(listItems[2])
    expect(screen.queryByText(/step three/i)).toBeNull()
    expect(getInstructions()).toHaveLength(2)
  });

  test('all instructions can be removed', () => {
    for(let i = 0; i < recipe.instructions.length ; i++){
      let listItems = getInstructions()
      removeInstruction(listItems[0])
    }
    expect(getInstructions()).toHaveLength(0)
  })

 })

});