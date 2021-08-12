import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { TITLE_MY_RECIPES } from '../../components/MyRecipesPage';
import userFixture from '../fixtures/user/userSomeRecipes';
import myRecipesPageTestHelper from '../util/myRecipesPageTestHelper';
import recipePageTestHelper from '../util/recipePageTestHelper';

jest.mock('axios')

describe('Integration tests between RecipePage and MyRecipesPage', () => {
  let user;
  afterEach(() => {
    cleanup;
    axios.get.mockRestore()
  });

  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    user = userFixture()
  });

  afterAll(() => {
    jest.useRealTimers()
  })

  test('Clicking on the delete recipe button on RecipePage deletes the recipe and returns you to MyRecipesPage', async () => {
    //mock data for MyRecipes page load
    axios.get.mockResolvedValueOnce({
      data: {
        recipes: user.recipes
      }
    })
    await myRecipesPageTestHelper.renderPage(user)

    //mock data for a specific recipe
    axios.get.mockResolvedValueOnce({
      data: user.recipes[0]
    })
    userEvent.click(screen.getByText(user.recipes[0].name));
    await recipePageTestHelper.waitForSnackbar() //wait for recipe page to load

    let recipesWithFirstRemoved = user.recipes.filter((recipe) => recipe.id !== user.recipes[0].id)
    axios.get.mockResolvedValueOnce({
      data: {
        recipes: recipesWithFirstRemoved
      }
    })

    recipePageTestHelper.clickDelete(true)
    

    //expect title to by MyRecipes
    expect(await screen.findByText(TITLE_MY_RECIPES)).toBeInTheDocument()
    //expect recipes[0].name not to be in the DOM
    expect(screen.queryByText(user.recipes[0].name)).toBeNull()
  })
  
})