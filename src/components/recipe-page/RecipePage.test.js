import { screen, waitFor } from '@testing-library/react';
import { PATH_LOGIN, PATH_MYRECIPES } from '../../paths';
import recipeService from '../../services/recipeService';
import recipeFixture from '../../test/fixtures/recipes/spaghetti';
import userFixture from '../../test/fixtures/user/userNoRecipes';
import testHelper from '../../test/util/recipePageTestHelper';
import { ID_EDIT_BUTTON, MESSAGE_RECIPE_LOADED } from './RecipePage';


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
  })


  describe('tests with an existing recipe', () => {
    let history;
    beforeEach(async () => {
      ({history} = await testHelper.setupAndRenderRecipe(recipeFixture(), userFixture()));
    })

    describe('tests for updating recipes', () => {


      test('recipes can be updated', async () => {
        let desc = "Something else"
        let updatedRecipe = recipeFixture()
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