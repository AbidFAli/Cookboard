import { cleanup, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import userFixture from '../../test/fixtures/user/userNoRecipes';
import testHelper from '../../test/util/recipePageTestHelper';
import {
  ERROR_MSG_RECIPE_NAME_MISSING,
  ID_FIELD_RECIPE_NAME
} from './RecipeName';
import { ID_EDIT_BUTTON } from './RecipePage';


jest.mock('../../services/recipeService')



describe('RecipeName', () => {
  afterEach(cleanup);
  let recipe = null;
  


  describe('On a page with a created recipe', () => {
    beforeEach(async () => {
      recipe = {
        name: "waffles",
        id: "12345"
      }
      await testHelper.setupAndRenderRecipe(recipe, userFixture())
      fireEvent.click(screen.getByTestId(ID_EDIT_BUTTON))
    });

    test('an error is displayed if the recipe name is cleared', () => {
      let textbox = screen.getByTestId(ID_FIELD_RECIPE_NAME)
      userEvent.clear(textbox)
      expect(screen.getByText(ERROR_MSG_RECIPE_NAME_MISSING)).toBeInTheDocument()
    })

    
    test('The name of a created recipe can be changed', () => {
      let textbox = screen.getByTestId(ID_FIELD_RECIPE_NAME)
      userEvent.clear(textbox)
      userEvent.type(textbox, "Sushi")
      expect(screen.getByDisplayValue("Sushi")).toBeInTheDocument()
    })
  });

  describe('on a page with a blank recipe', () => {
    beforeEach(async () => {
      await testHelper.setupAndRenderRecipe(null, userFixture())
    });

    test('the name of the recipe can be set' , () => {
      let textbox = screen.getByTestId(ID_FIELD_RECIPE_NAME)
      userEvent.type(textbox, "Sushi")
      expect(screen.getByDisplayValue("Sushi")).toBeInTheDocument()
    })
  })

});
