import { cleanup, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import userFixture from '../../../test/fixtures/user/userNoRecipes';
import testHelper from '../../../test/util/recipePageTestHelper';
import { ID_EDIT_BUTTON, ID_SAVE_BUTTON } from './RecipePage';
import {
  ERROR_MSG_NUM_SERVED_NAN, ERROR_MSG_SERVING_SIZE_NAN, ERROR_MSG_YIELD_NAN, FIELD_NUM_SERVED, FIELD_SERVING_SIZE, FIELD_YIELD
} from './ServingInfoList';


jest.mock('../../../services/recipeService')

//Integration tests for ServingInfoList in RecipePage

const testNonNumericalText = async (recipe, user,  testid, expectedMessage) => {
  await testHelper.setupAndRenderRecipe(recipe, user)
  fireEvent.click(screen.getByTestId(ID_EDIT_BUTTON))
  let textbox = screen.getByTestId(testid)
  userEvent.clear(textbox)
  userEvent.type(textbox, "letters")
  expect(screen.getByText(expectedMessage)).toBeInTheDocument()
}

describe('ServingInfoList', () => {
  let recipe;
  let user;
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    user = userFixture();
    recipe = {
      name: "waffles",
      id: "12346",
      user: user.id
    }
  })

  afterEach(cleanup);

  afterAll(() => {
    jest.useRealTimers()
  })


  test('cannot save if there is an error in the textboxes', async () => {
    await testHelper.setupAndRenderRecipe(recipe, user)
    fireEvent.click(screen.getByTestId(ID_EDIT_BUTTON))
    let textbox = screen.getByTestId(FIELD_NUM_SERVED)
    userEvent.clear(textbox)
    userEvent.type(textbox, "letters")
    expect(screen.getByTestId(ID_SAVE_BUTTON)).toBeDisabled()
  })

  describe('when editing numServed', () => {
    test('displays an error message when non-numerical text is typed' , async () => {
      await testNonNumericalText(recipe, user, FIELD_NUM_SERVED, ERROR_MSG_NUM_SERVED_NAN)
    })
  })

  describe('when editing yield', () => {
    test('displays an error message when non-numerical text is typed' , async () => {
      await testNonNumericalText(recipe, user,  FIELD_YIELD, ERROR_MSG_YIELD_NAN)
    })
  })

  describe('when editing serving size', () => {
    test('displays an error message when non-numerical text is typed' , async () => {
      await testNonNumericalText(recipe, user,  FIELD_SERVING_SIZE, ERROR_MSG_SERVING_SIZE_NAN)
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