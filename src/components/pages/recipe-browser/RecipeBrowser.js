import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import MobileStepper from "@material-ui/core/MobileStepper";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import recipeService from "../../../services/recipeService";
import { RecipeList } from "../../RecipeList";
import { RecipeBrowserOptions } from "./RecipeBrowserOptions";

const ID_SEARCH_BUTTON = "browserSearchButton";
const ID_SEARCH_BAR = "browserSearchBar";
const ID_RESULTS_INFO = "browserResultsInfo";
const ID_NEXT_BUTTON = "browserNextButton";
const ID_BACK_BUTTON = "browserBackButton";

const ids = {
  ID_SEARCH_BUTTON,
  ID_SEARCH_BAR,
  ID_RESULTS_INFO,
  ID_NEXT_BUTTON,
  ID_BACK_BUTTON,
};

const errorMessages = {};

const TEXT_SEARCH_BUTTON = "Search";
const INITIAL_LIST_MESSAGE = "Search for a recipe";

/*
 *@prop snackbarRef
 */
function RecipeBrowser(props) {
  const [searchOptions, setSearchOptions] = useState({
    name: "",
    ingredient: "",
    ratingMin: 0,
    ratingMax: 5,
  });
  const [recipes, setRecipes] = useState([]);
  const [searching, setSearching] = useState(false);
  const [resultsTotal, setResultsTotal] = useState(0);
  const [batchNumber, setCurrentBatchNumber] = useState(0); //0 indexed
  const resultSize = recipeService.DEFAULT_SEARCH_BATCH_SIZE;
  const maxBatch = Math.ceil(resultsTotal / resultSize);
  let currentPos = batchNumber * resultSize;

  const performNewSearch = async () => {
    setSearching(true);
    let resultsTotal = await recipeService.getNumberSearchResults(
      searchOptions
    );
    let results = await recipeService.search(searchOptions, 0, resultSize);
    setRecipes(results);
    setResultsTotal(resultsTotal);
  };

  const setSearchOptionsName = (name) => {
    let newOptions = { ...searchOptions };
    newOptions.name = name.trim();
    setSearchOptions(newOptions);
  };

  const handleNext = async () => {
    let results = await recipeService.search(
      searchOptions,
      (batchNumber + 1) * resultSize,
      resultSize
    );
    setRecipes(results);
    setCurrentBatchNumber(batchNumber + 1);
  };

  const handleBack = async () => {
    let results = await recipeService.search(
      searchOptions,
      (batchNumber - 1) * resultSize,
      resultSize
    );
    setRecipes(results);
    setCurrentBatchNumber(batchNumber - 1);
  };

  const searchButton = (
    <Button data-testid={ID_SEARCH_BUTTON} onClick={performNewSearch}>
      {TEXT_SEARCH_BUTTON}
    </Button>
  );

  const searchBar = (
    <TextField
      value={searchOptions.name}
      inputProps={{ "data-testid": ID_SEARCH_BAR }}
      type="search"
      onChange={(event) => setSearchOptionsName(event.target.value)}
      helperText="Enter a recipe name"
    />
  );

  const resultsInfo = (
    <Grid item>
      <Typography variant="subtitle1" data-testid={ID_RESULTS_INFO}>
        Showing results from {currentPos + 1} to {currentPos + recipes.length}{" "}
        of {resultsTotal} results
      </Typography>
    </Grid>
  );

  const stepper = (
    <Grid item>
      <MobileStepper
        steps={maxBatch}
        position="bottom"
        variant="text"
        activeStep={batchNumber}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={batchNumber === maxBatch - 1}
            data-testid={ID_NEXT_BUTTON}
          >
            Next
          </Button>
        }
        backButton={
          <Button
            size="small"
            onClick={handleBack}
            disabled={batchNumber === 0}
            data-testid={ID_BACK_BUTTON}
          >
            Back
          </Button>
        }
      />
    </Grid>
  );

  return (
    <Grid container direction="column">
      <Grid item container direction="row">
        {searchBar}
        {searchButton}
      </Grid>
      {searching && resultsInfo}
      <Grid item container direction="row-reverse">
        <Grid item container xs={12} md={4} direction="column">
          <RecipeBrowserOptions
            searchOptions={searchOptions}
            updateSearchOptions={setSearchOptions}
          />
        </Grid>
        <Grid item container xs={12} md={8} direction="column">
          <Paper>
            <RecipeList
              recipes={recipes}
              messageNoContent={INITIAL_LIST_MESSAGE}
            />
          </Paper>
        </Grid>
      </Grid>
      {searching && stepper}
    </Grid>
  );
}

RecipeBrowser.propTypes = {};

export { RecipeBrowser, ids, errorMessages };
