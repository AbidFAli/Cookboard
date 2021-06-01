import React from 'react';
import { cleanup, screen, render, fireEvent } from '@testing-library/react';
import {within} from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import { Ingredient } from '../../Model/ingredient.js'
import { 
  ERROR_MSG_NUM_SERVED_NAN,
  ERROR_MSG_YIELD_NAN,
  ERROR_MSG_SERVING_SIZE_NAN,
  FIELD_NUM_SERVED, 
  FIELD_YIELD, 
  FIELD_SERVING_SIZE 
} from './ServingInfoList'
import { RecipePage} from './RecipePage';

jest.mock('../../services/recipeService')

//Integration tests for ServingInfoList in RecipePage

describe('ServingInfoList', () => {
  afterEach(cleanup);
  let recipe = null;
  let addHandler, updateHandler;

  function renderRecipe(recipe) {
      render(<RecipePage recipe = {recipe} prevPath = "" handleAddRecipe = {addHandler} handleUpdateRecipe = {updateHandler} />);
  }

  const testNonNumericalText = (testid, expectedMessage) => {
    renderRecipe(recipe)
    fireEvent.click(screen.getByTestId('editButton'))
    let textbox = screen.getByTestId(testid)
    userEvent.clear(textbox)
    userEvent.type(textbox, "letters")
    expect(screen.getByText(expectedMessage)).toBeInTheDocument()
  }



  beforeEach(() => {
      addHandler = jest.fn()
      updateHandler = jest.fn()
      recipe = {
        name: "waffles"
      }
  });

  test('cannot save if there is an error in the textboxes', () => {
    renderRecipe(recipe)
    fireEvent.click(screen.getByTestId('editButton'))
    let textbox = screen.getByTestId(FIELD_NUM_SERVED)
    userEvent.clear(textbox)
    userEvent.type(textbox, "letters")
    expect(screen.getByTestId("saveButton")).toBeDisabled()
  })

  describe('when editing numServed', () => {
    test('displays an error message when non-numerical text is typed' , () => {
      testNonNumericalText(FIELD_NUM_SERVED, ERROR_MSG_NUM_SERVED_NAN)
    })
  })

  describe('when editing yield', () => {
    test('displays an error message when non-numerical text is typed' , () => {
      testNonNumericalText(FIELD_YIELD, ERROR_MSG_YIELD_NAN)
    })
  })

  describe('when editing serving size', () => {
    test('displays an error message when non-numerical text is typed' , () => {
      testNonNumericalText(FIELD_SERVING_SIZE, ERROR_MSG_SERVING_SIZE_NAN)
    })

  })

  // describe('when editing serving size unit', ()=> {
  //   test('TO DO', () => {
  //     recipe.servingInfo = {
  //       numServed : 1,
  //       yield : 24,
  //       servingSize: 100,
  //       unit: 'grams'
  //     }
  //   })
  // })

});