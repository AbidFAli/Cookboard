import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { cloneDeep } from 'lodash';
import React from 'react';
import { ID_SAVE_BUTTON, MESSAGE_RECIPE_LOADED, RecipePage } from '../../components/recipe-page/RecipePage';



//private methods
const renderRecipe = (recipeName,recipeId, user) => {
  let addHandler, updateHandler;
  addHandler = jest.fn();
  updateHandler = jest.fn();
  render(
    <div>
      <RecipePage 
        name = {recipeName}
        id = {recipeId}
        user = {user}
        prevPath = "/myrecipes" 
        handleAddRecipe = {addHandler} 
        handleUpdateRecipe = {updateHandler} />
    </div>
  ) ;
}

const waitForSnackbar = async () => {
  return waitFor(() => expect(screen.getByText(MESSAGE_RECIPE_LOADED)).toBeInTheDocument())
}

//public methods

/*
*@param recipe: Recipe || null
*@desc: 
*   Renders the RecipePage using the provided recipe object. Then waits for page to load.
*   Call this after populating recipe object.
*/
const setupAndRenderRecipe =  async (recipe, user) => {
  let recipeName = recipe && recipe.name ? recipe.name : '';
  let recipeId = recipe && recipe.id ? recipe.id : '';
  axios.get.mockResolvedValue({data : cloneDeep(recipe)})
  renderRecipe(recipeName, recipeId, user)
  if(recipe){
    await waitForSnackbar()
  }
  else{
    Promise.resolve()
  }
  
}

const expectSaveButtonDisabled = () => {
  expect(screen.getByTestId(ID_SAVE_BUTTON)).toBeDisabled()
}

const expectSaveButtonEnabled = () => {
  expect(screen.getByTestId(ID_SAVE_BUTTON)).toBeEnabled()
}


const testHelper = {
  setupAndRenderRecipe,
  expectSaveButtonDisabled,
  expectSaveButtonEnabled
}

export default testHelper;

