import { cleanup, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import userFixture from '../../test/fixtures/user/userNoRecipes';
import testHelper from '../../test/util/recipePageTestHelper';
import { ID_EDIT_BUTTON } from './RecipePage';
import {
  ERROR_MESSAGE_TTM_UNIT_MISSING,
  ERROR_MESSAGE_TTM_VALUE_MISSING,
  ERROR_MESSAGE_TTM_VALUE_NAN, ID_FIELD_TTM_UNIT,
  ID_FIELD_TTM_VALUE
} from './TimingInfo';


jest.mock('../../services/recipeService')

const getUnitTextbox = () => {
  return screen.getByTestId(ID_FIELD_TTM_UNIT)
}

const getValueTextbox = () => {
  return screen.getByTestId(ID_FIELD_TTM_VALUE)
}


describe('RecipeName', () => {
  afterEach(cleanup);
  let recipe = null;

  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  });

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('with a blank recipe', () => {
    beforeEach(async () => {
      await testHelper.setupAndRenderRecipe(recipe, userFixture())
    });

    test('the time to make unit can be set', () => {
      let textbox = screen.getByTestId(ID_FIELD_TTM_UNIT)
      userEvent.clear(textbox)
      userEvent.type(textbox, "hours")
      expect(screen.getByTestId(ID_FIELD_TTM_UNIT)).toHaveDisplayValue("hours")
    })
  
    test('the time to make value can be set' , () => {
      let textbox = screen.getByTestId(ID_FIELD_TTM_VALUE)
      userEvent.clear(textbox)
      userEvent.type(textbox, "1")
      expect(screen.getByTestId(ID_FIELD_TTM_VALUE)).toHaveDisplayValue("1")
    })

  })

  describe('with existing timing info already set', () => {
    beforeEach(async () => {
      let user = userFixture()
      recipe = {
        name: "waffles",
        timeToMake : { value: 10, unit: "minutes"},
        id: "121",
        user: user.id
      }
      await testHelper.setupAndRenderRecipe(recipe, user)
      fireEvent.click(screen.getByTestId(ID_EDIT_BUTTON))
    });

    describe('Cases when error should be displayed and create recipe button should be disabled:', () => {
      test('if the prep time value is present but the prep time unit is missing', () => {
        let textbox = getUnitTextbox()
        userEvent.clear(textbox)
        expect(screen.getByText(ERROR_MESSAGE_TTM_UNIT_MISSING)).toBeInTheDocument()
        testHelper.expectSaveButtonDisabled()
      })

      test('if the prep time unit is present but the prep time value is missing' , () => {
        let textbox = getValueTextbox()
        userEvent.clear(textbox)
        expect(screen.getByText(ERROR_MESSAGE_TTM_VALUE_MISSING)).toBeInTheDocument()
        testHelper.expectSaveButtonDisabled()
      })

      test('an error is displayed if letters are typed into the textbox for prep time value', () => {
        let textbox = getValueTextbox()
        userEvent.clear(textbox)
        userEvent.type(textbox, "letters")
        expect(screen.getByText(ERROR_MESSAGE_TTM_VALUE_NAN)).toBeInTheDocument()
        testHelper.expectSaveButtonDisabled()
      })
    })

    
    test('you can delete the timing info and still click on the create recipe button', () => {
      let unitInput = getUnitTextbox()
      let valueInput = getValueTextbox()
      userEvent.clear(unitInput)
      userEvent.clear(valueInput)
      testHelper.expectSaveButtonEnabled()
    })

  })




});