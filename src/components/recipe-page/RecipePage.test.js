import { screen, waitFor } from '@testing-library/react';
import { PATH_LOGIN, PATH_MYRECIPES } from '../../paths';
import recipeService from '../../services/recipeService';
import recipeFixture from '../../test/fixtures/recipes/spaghetti';
import userFixture from '../../test/fixtures/user/userNoRecipes';
import userSomeRecipes from '../../test/fixtures/user/userSomeRecipes';
import testHelper from '../../test/util/recipePageTestHelper';
import {
  ID_DELETE_BUTTON, ID_EDIT_BUTTON,
  ID_SAVE_BUTTON, MESSAGE_RECIPE_LOADED,
  MESSAGE_TOKEN_EXPIRED
} from './RecipePage';


//jest.mock('axios')
jest.mock('../../services/recipeService')




const createTokenExpiredError = () => {
  return {
    response: {
      status: 403,
      data: {
        name: 'TokenExpiredError',
        message: 'Token expired'
      }
    }
  }
}



describe('Tests for RecipePage', () => {

  beforeEach(() => {
    jest.useFakeTimers()
    jest.resetAllMocks()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  test('a message appears when the recipe is loaded', async () => {
    await testHelper.setupAndRenderRecipe(recipeFixture(), userFixture())
    expect(await screen.findByText(MESSAGE_RECIPE_LOADED)).toBeInTheDocument()
  });

  test('blank recipes start in editing mode', async () => {
    await testHelper.setupAndRenderRecipe(null, userFixture())
    expect(screen.queryByTestId(ID_EDIT_BUTTON)).toBeNull()
  })

  test('a new recipe cannot be created wihout a user', async () => {
    await testHelper.setupAndRenderRecipe()
    expect(screen.queryByTestId(ID_SAVE_BUTTON)).toBeNull()
  })

  test('recipes cannot be edited or deleted without a user', async () => {
    await testHelper.setupAndRenderRecipe(recipeFixture())
    expect(screen.queryByTestId(ID_EDIT_BUTTON)).toBeNull()
    expect(screen.queryByTestId(ID_DELETE_BUTTON)).toBeNull()
  })


  describe('tests for recipe creation', () => {
    let history;
    beforeEach(async () => {
      ({history} = await testHelper.setupAndRenderRecipe(null, userFixture()));
    })

    test('canceling creating a new recipe returns you to the myrecipes page ', async () => {
      testHelper.clickCancel()
      expect(history.location.pathname).toEqual(PATH_MYRECIPES)
    })

    test('recipes can be created', async () => {
      let recipeName = "Waffles"
      testHelper.enterRecipeName(recipeName)
      recipeService.create.mockResolvedValueOnce({name: recipeName, id: "1234"})
      testHelper.clickSave()
      expect(recipeService.create.mock.calls[0][0]).toMatchObject({name : recipeName})
      await waitFor(() => expect(history.location.pathname).not.toMatch(/new/));
    });

    test("Clicking save will redirect to the login page if a user's token has expired", async() => {
      testHelper.enterRecipeName("Waffles")
      recipeService.create.mockRejectedValueOnce(createTokenExpiredError())
      testHelper.clickSave()
      await waitFor(() => expect(history.location.pathname).toEqual(PATH_LOGIN))
         
    })
    
    test("A message will be displayed to the user if a TokenExpiredError occurs", async () => {
      testHelper.enterRecipeName("Waffles")
      recipeService.create.mockRejectedValueOnce(createTokenExpiredError())
      testHelper.clickSave()
      expect(await screen.findByText(MESSAGE_TOKEN_EXPIRED)).toBeInTheDocument();  
    })
  })

  

  describe('tests with an existing recipe', () => {
    let history;
    let user;
    let recipe;
    
    function testRecipe(){ 
      return userSomeRecipes().recipes[0] 
    }

    beforeEach(async () => {
      user = userSomeRecipes();
      recipe = testRecipe();
      ({history} = await testHelper.setupAndRenderRecipe(recipe, user));
    })

    describe('tests for updating recipes', () => {


      test('recipes can be updated', async () => {
        let desc = "Something else"
        let updatedRecipe = testRecipe()
        updatedRecipe.description = desc

        testHelper.clickEdit()
        testHelper.enterDescription(desc)
        recipeService.update.mockResolvedValueOnce(updatedRecipe)
        testHelper.clickSave()
        await waitFor(() => expect(screen.getByText(desc)).toBeInTheDocument())
      });
  
      test("Clicking update will redirect to the login page if a user's token has expired", async() => {
        recipeService.update.mockRejectedValueOnce(createTokenExpiredError())
        testHelper.clickEdit()
        testHelper.clickSave()
        await waitFor(() => expect(history.location.pathname).toEqual(PATH_LOGIN))      
      })
  
    })

    describe('tests for deleting recipes', () => {
      
      test('Clicking delete will take you to the MyRecipes page', async () =>{
        recipeService.destroy.mockResolvedValueOnce({})
        testHelper.clickDelete()
        await waitFor(() => expect(history.location.pathname).toEqual(PATH_MYRECIPES))
      })

      test("Clicking delete will redirect to the login page if a user's token has expired", async() => {
        recipeService.destroy.mockRejectedValueOnce(createTokenExpiredError())
        testHelper.clickDelete()
        await waitFor(() => expect(history.location.pathname).toEqual(PATH_LOGIN))
      })
    });
    
  })
  
})