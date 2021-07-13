import { screen } from '@testing-library/react';
import recipeFixture from '../../test/fixtures/recipes/spaghetti';
import userFixture from '../../test/fixtures/user/userNoRecipes';
import testHelper from '../../test/util/recipePageTestHelper';
import { MESSAGE_RECIPE_LOADED } from './RecipePage';

jest.mock('axios')

describe('Tests for RecipePage', () => {

  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  test('a message appears when the recipe is loaded', async () => {
    await testHelper.setupAndRenderRecipe(recipeFixture(), userFixture())
    expect(await screen.findByText(MESSAGE_RECIPE_LOADED)).toBeInTheDocument()
  });
})