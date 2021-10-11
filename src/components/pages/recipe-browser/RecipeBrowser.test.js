import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import React from "react";
import { Router } from "react-router";
import { Route, Switch } from "react-router-dom";
import { Recipe } from "../../../Model/recipe";
import { PATH_RECIPES, PATH_SEARCH } from "../../../paths";
import recipeService from "../../../services/recipeService";
import { ids, RecipeBrowser } from "./RecipeBrowser";
import {
  errorMessages as optionsErrors,
  ids as optionsIds,
} from "./RecipeBrowserOptions";

//do this as a manual mock
jest.mock("../../../services/recipeService.js", () => {
  const module = {
    create: jest.fn(),
    getById: jest.fn(),
    getAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    getRecipesForUser: jest.fn(),
    search: jest.fn(),
    getNumberSearchResults: jest.fn(),
    DEFAULT_SEARCH_BATCH_SIZE: 5,
  };
  return {
    __esModule: true,
    default: module,
  };
});

async function renderBrowser() {
  const history = createMemoryHistory({ initialEntries: [PATH_SEARCH] });
  await act(async () => {
    render(
      <Router history={history}>
        <Switch>
          <Route path={PATH_SEARCH}>
            <RecipeBrowser />
          </Route>
          <Route path={PATH_RECIPES}></Route>
        </Switch>
      </Router>
    );
  });
  return history;
}

function setRatingMax(val) {
  val = val.toString();
  let textbox = screen.getByTestId(optionsIds.ID_INPUT_MAX_RATING);
  userEvent.clear(textbox);
  userEvent.type(textbox, val);
  textbox.blur();
}

function setRatingMin(val) {
  val = val.toString();
  let textbox = screen.getByTestId(optionsIds.ID_INPUT_MIN_RATING);
  userEvent.clear(textbox);
  userEvent.type(textbox, val);
  textbox.blur();
}

async function performInitialSearch(results, totalResults) {
  let initialCalls = recipeService.search.mock.calls.length;
  recipeService.getNumberSearchResults.mockResolvedValueOnce(totalResults);
  recipeService.search.mockResolvedValueOnce(results);
  userEvent.click(screen.getByTestId(ids.ID_SEARCH_BUTTON));
  await waitFor(() =>
    expect(recipeService.search.mock.calls.length).toBeGreaterThan(initialCalls)
  );
}

//ex: vnr([...recipes], 5, 5) shows recipes from index [5, 10) and returns 10
async function viewNextRecipes(recipes, currentPos, resultSize = 5) {
  let nextRecipes = recipes.slice(currentPos, currentPos + resultSize);
  recipeService.search.mockResolvedValueOnce(nextRecipes);
  userEvent.click(screen.getByTestId(ids.ID_NEXT_BUTTON));
  let resultsInfo = screen.getByTestId(ids.ID_RESULTS_INFO);

  await waitFor(() =>
    expect(resultsInfo).toHaveTextContent(
      `Showing results from ${currentPos + 1} to ${
        currentPos + nextRecipes.length
      } of ${recipes.length} results`
    )
  );
  return currentPos + nextRecipes.length;
}

//can be made from modification of the above. Ex: just start back 5 and pass that in as
async function viewPreviousRecipes(recipes, currentPos, resultSize = 5) {
  let start = currentPos - resultSize < 0 ? 0 : currentPos - resultSize;
  let nextRecipes = recipes.slice(start, currentPos);
  recipeService.search.mockResolvedValueOnce(nextRecipes);
  userEvent.click(screen.getByTestId(ids.ID_BACK_BUTTON));
  let resultsInfo = screen.getByTestId(ids.ID_RESULTS_INFO);

  await waitFor(() =>
    expect(resultsInfo).toHaveTextContent(
      `Showing results from ${start + 1} to ${start + nextRecipes.length} of ${
        recipes.length
      } results`
    )
  );
  return start;
}

describe("tests for RecipeBrowser", () => {
  let history;
  beforeEach(async () => {
    history = await renderBrowser();
  });

  describe("tests for BrowserSearchOptions", () => {
    test("if ratingMax < ratingMin an error will be displayed", async () => {
      setRatingMax(2);
      setRatingMin(4);
      expect(
        await screen.findByText(optionsErrors.ERROR_MESSAGE_MAX_LESS_MIN)
      ).toBeInTheDocument();
    });

    test("if ratingMax is out of range [0,5] an error will be displayed", async () => {
      setRatingMax(7);
      expect(
        await screen.findByText(optionsErrors.ERROR_OUT_OF_RANGE)
      ).toBeInTheDocument();
    });

    test("if ratingMin is out of range [0,5]  an error will be displayed", async () => {
      setRatingMin(-1);
      expect(
        await screen.findByText(optionsErrors.ERROR_OUT_OF_RANGE)
      ).toBeInTheDocument();
    });
  });

  test("text can be entered in the search bar", async () => {
    let searchBar = screen.getByTestId(ids.ID_SEARCH_BAR);
    let searchTerm = "something";
    userEvent.type(searchBar, searchTerm);
    expect(searchBar).toHaveDisplayValue(searchTerm);
  });
  test("text can be entered in the ingredients bar", async () => {
    let ingredientsBar = screen.getByTestId(ids.ID_SEARCH_BAR);
    let ingredient = "apples";
    userEvent.type(ingredientsBar, ingredient);
    expect(ingredientsBar).toHaveDisplayValue(ingredient);
  });

  test("searching displays the first set of results and a count of the total number of results", async () => {
    const response = [
      { name: "Brownies", id: 1000 },
      { name: "Fudge Brownies", id: 1001 },
      { name: "Best Brownies", id: 1002 },
      { name: "Amazing Brownies", id: 1003 },
      { name: "Awesome Brownies", id: 1004 },
    ];
    const totalResults = 100;
    userEvent.type(screen.getByTestId(ids.ID_SEARCH_BAR), "Brownies");
    await performInitialSearch(response, totalResults);
    let resultsInfo = await screen.findByTestId(ids.ID_RESULTS_INFO);

    expect(resultsInfo).toHaveTextContent(`1 to 5 of ${totalResults}`);
    for (let recipe of response) {
      expect(screen.getByText(recipe.name)).toBeInTheDocument();
    }
  });

  describe("tests for search", () => {
    let testRecipes;
    let currentPos = 0;
    const resultSize = 5;
    const searchText = "something";

    beforeEach(async () => {
      testRecipes = [];
      let recipeName = "something";
      for (let i = 0; i < 15; i++) {
        testRecipes.push(new Recipe(recipeName + i));
      }
      userEvent.type(screen.getByTestId(ids.ID_SEARCH_BAR), searchText);
      await performInitialSearch(testRecipes.slice(0, 5), testRecipes.length);
      currentPos = 5;
    });

    test("previous search results and options are restored when use the browser's back button to navigate to this page", async () => {
      history.push(PATH_RECIPES);
      await waitFor(() =>
        expect(screen.queryByTestId(ids.ID_SEARCH_BAR)).toBeNull()
      );
      history.goBack();
      let searchBar = await screen.findByTestId(ids.ID_SEARCH_BAR);
      expect(searchBar).toHaveDisplayValue(searchText);

      for (let i = 0; i < 5; i++) {
        expect(screen.getByText(testRecipes[i].name)).toBeInTheDocument();
      }
    });

    describe("tests for pagination", () => {
      test("the back button is disabled on the first page of results", async () => {
        expect(screen.getByTestId(ids.ID_BACK_BUTTON)).toBeDisabled();
      });

      test("clicking the next button shows the next set of results", async () => {
        await viewNextRecipes(testRecipes, currentPos, resultSize);
        for (let i = 5; i < 10; i++) {
          expect(screen.getByText(testRecipes[i].name)).toBeInTheDocument();
        }
      });

      test("the next button is disabled on the last page", async () => {
        let batchSize = 5;
        let numBatches = Math.ceil(testRecipes.length / batchSize);
        const nextButton = screen.getByTestId(ids.ID_NEXT_BUTTON);
        const resultsInfo = screen.getByTestId(ids.ID_RESULTS_INFO);
        for (let i = 1; i < numBatches; i++) {
          let nextRecipes = testRecipes.slice(
            i * batchSize,
            (i + 1) * batchSize
          );
          recipeService.search.mockResolvedValueOnce(nextRecipes);
          userEvent.click(nextButton);
          await waitFor(() =>
            expect(resultsInfo).toHaveTextContent(
              `${i * batchSize + 1} to ${
                i * batchSize + nextRecipes.length
              } of ${testRecipes.length}`
            )
          );
        }
        expect(nextButton).toBeDisabled();
      });

      describe("on the second page", () => {
        beforeEach(async () => {
          //now showing [5, 10)
          await viewNextRecipes(testRecipes, currentPos, resultSize);
        });

        test("clicking the back button shows the previous set of results", async () => {
          await viewPreviousRecipes(testRecipes, currentPos, resultSize);
          for (let i = 0; i < 5; i++) {
            expect(
              await screen.findByText(testRecipes[i].name)
            ).toBeInTheDocument();
          }
        });
      });
    });
  });
});
