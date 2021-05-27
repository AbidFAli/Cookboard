import React from 'react';
import { cleanup, screen, render, fireEvent } from '@testing-library/react';
import {within} from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { 
  ERROR_MSG_RECIPE_NAME_MISSING,
  ID_FIELD_RECIPE_NAME
} from './RecipeName'
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
        name: "waffles"
      }
  });

  test('an error is displayed if the recipe name is blank', () => {
    renderRecipe(recipe)
    fireEvent.click(screen.getByTestId('editButton'))
    let textbox = screen.getByTestId(ID_FIELD_RECIPE_NAME)
    userEvent.clear(textbox)
    expect(screen.getByText(ERROR_MSG_RECIPE_NAME_MISSING)).toBeInTheDocument()
  })


});
