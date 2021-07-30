import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from "history";
import { cloneDeep } from 'lodash';
import React from 'react';
import { Router } from "react-router";
import { SnackbarProvider } from '../../components/NotificationSnackbar';
import { ID_FIELD_DESCRIPTION } from '../../components/recipe-page/Description';
import { ID_FIELD_RECIPE_NAME } from '../../components/recipe-page/RecipeName';
import {
  ID_CANCEL_BUTTON, ID_DELETE_BUTTON, ID_EDIT_BUTTON,
  ID_SAVE_BUTTON, MESSAGE_RECIPE_LOADED, RecipePage
} from '../../components/recipe-page/RecipePage';
import recipeService from '../../services/recipeService';



//private methods
/*
 *Renders a RecipePage with the specified name and id, created by the provided user.\
 *@returns {
   history: history object for the page
 }
 */
const renderRecipe = (recipeName,recipeId, user) => {
  let addHandler, updateHandler, removeHandler;
  addHandler = jest.fn();
  updateHandler = jest.fn();
  removeHandler = jest.fn();
  
  let initialEntries = [`/myrecipes/${recipeId ?? 'new'}`,'/myrecipes']
  const history =  createMemoryHistory({initialEntries})
  const ref = React.createRef()
  render(
    <Router history = {history} >
      <RecipePage 
        name = {recipeName}
        id = {recipeId}
        user = {user}
        prevPath = "/myrecipes" 
        handleAddRecipe = {addHandler} 
        handleUpdateRecipe = {updateHandler}
        handleDeleteRecipe = {removeHandler}
        snackbarRef = {ref} />
      <SnackbarProvider ref = {ref} />
    </Router>

  ) ;

  return {history}
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
*@returns {
  history: history object used in the Recipe Page
}
*/
const setupAndRenderRecipe =  async (recipe, user) => {
  let recipeName = recipe && recipe.name ? recipe.name : null;
  let recipeId = recipe && recipe.id ? recipe.id : null;
  recipeService.getById.mockResolvedValue(cloneDeep(recipe))
  let {history} = renderRecipe(recipeName, recipeId, user)
  if(recipe){
    await waitForSnackbar()
  }
  return {
    history
  }
  
}

const expectSaveButtonDisabled = () => {
  expect(screen.getByTestId(ID_SAVE_BUTTON)).toBeDisabled()
}

const expectSaveButtonEnabled = () => {
  expect(screen.getByTestId(ID_SAVE_BUTTON)).toBeEnabled()
}

const clickCancel = () => {
  userEvent.click(screen.getByTestId(ID_CANCEL_BUTTON))
}

const clickEdit = () => {
  userEvent.click(screen.getByTestId(ID_EDIT_BUTTON))
}

const clickDelete = (yes) => {
  let pass = yes;
  if(pass === undefined){
    pass = true;
  }
  window.confirm.mockReturnValueOnce(pass)
  userEvent.click(screen.getByTestId(ID_DELETE_BUTTON))
}

const clickSave = () => {
  let button = screen.getByTestId(ID_SAVE_BUTTON)
  userEvent.click(button)
}

const enterRecipeName = (name) => {
  let field = screen.getByTestId(ID_FIELD_RECIPE_NAME)
  userEvent.clear(field)
  userEvent.type(field, name)
}

const enterDescription = (desc) => {
  let field = screen.getByTestId(ID_FIELD_DESCRIPTION)
  userEvent.clear(field)
  userEvent.type(field, name)
}

const getEditButton = () => {
  return screen.getByTestId(ID_EDIT_BUTTON)
}


const testHelper = {
  setupAndRenderRecipe,
  expectSaveButtonDisabled,
  expectSaveButtonEnabled, 
  clickEdit,
  clickDelete,
  clickCancel,
  clickSave,
  getEditButton,
  waitForSnackbar,
  enterRecipeName,
  enterDescription
}

export default testHelper;

