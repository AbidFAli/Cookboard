import React from 'react';
import { cleanup, screen, render, fireEvent } from '@testing-library/react';
import {within} from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { 
  ID_FIELD_TTM_UNIT,
  ID_FIELD_TTM_VALUE,
  ERROR_MESSAGE_TTM_UNIT_MISSING,
  ERROR_MESSAGE_TTM_VALUE_MISSING
} from './TimingInfo'
import { RecipePage} from './RecipePage';

jest.mock('../../services/recipeService')

describe('RecipeName', () => {
  afterEach(cleanup);
  let recipe = null;
  let addHandler, updateHandler;

  function renderRecipe(recipe) {
      render(<RecipePage recipe = {recipe} prevPath = "" handleAddRecipe = {addHandler} handleUpdateRecipe = {updateHandler} />);
  }


  beforeEach(() => {
      addHandler = jest.fn()
      updateHandler = jest.fn()
      recipe = {
        name: "waffles",
        timeToMake : { value: "10", unit: "minutes"}
      }
      renderRecipe(recipe)
      fireEvent.click(screen.getByTestId('editButton'))
  });

  test('an error is displayed if the prep time value is present but the prep time unit is missing', () => {
  
    let textbox = screen.getByTestId(ID_FIELD_TTM_UNIT)
    userEvent.clear(textbox)
    expect(screen.getByText(ERROR_MESSAGE_TTM_UNIT_MISSING)).toBeInTheDocument()
  })

  test('an error is displayed if the prep time unit is present but the prep time value is missing' , () => {
    let textbox = screen.getByTestId(ID_FIELD_TTM_VALUE)
    userEvent.clear(textbox)
    expect(screen.getByText(ERROR_MESSAGE_TTM_VALUE_MISSING)).toBeInTheDocument()
  })


});