import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import React from "react";
import { useErrorMessenger } from "../../../Model/errorMessenger";
import { NumericInput } from "../../NumericInput";

const ID_INPUT_MIN_RATING = "minRatingInput";
const ID_INPUT_MAX_RATING = "maxRatingInput";
const ID_INPUT_INGREDIENT = "ingredientInput";
const ids = {
  ID_INPUT_MIN_RATING,
  ID_INPUT_MAX_RATING,
  ID_INPUT_INGREDIENT,
};

const ERROR_MESSAGE_MAX_LESS_MIN = "Max must be greater than min";
const ERROR_OUT_OF_RANGE = "Value must be between 0 and 5";
const errorMessages = {
  ERROR_MESSAGE_MAX_LESS_MIN,
  ERROR_OUT_OF_RANGE,
};
/*
 *@prop searchOptions
 *@prop updateSearchOptions
 */
function RecipeBrowserOptions({ searchOptions, updateSearchOptions }) {
  const { errors, ...errorFuncs } = useErrorMessenger();

  const handleIngredientChange = (event) => {
    let text = event.target.value;
    let newOptions = { ...searchOptions };
    newOptions.ingredient = text;
    updateSearchOptions(newOptions);
  };

  const setRatingMin = (newMin) => {
    let newOptions = { ...searchOptions };
    newOptions.ratingMin = newMin;
    updateSearchOptions(newOptions);
  };

  const setRatingMax = (newMax) => {
    let newOptions = { ...searchOptions };
    newOptions.ratingMax = newMax;
    updateSearchOptions(newOptions);
  };

  const validateMax = (newMax) => {
    if (newMax < searchOptions.ratingMin) {
      return ERROR_MESSAGE_MAX_LESS_MIN;
    } else if (newMax > 5 || newMax < 0) {
      return ERROR_OUT_OF_RANGE;
    } else {
      return "";
    }
  };

  const validateMin = (newMin) => {
    if (searchOptions.ratingMax < newMin) {
      return ERROR_MESSAGE_MAX_LESS_MIN;
    } else if (newMin > 5 || newMin < 0) {
      return ERROR_OUT_OF_RANGE;
    } else {
      return "";
    }
  };

  return (
    <React.Fragment>
      <TextField
        label="Ingredient"
        variant="outlined"
        value={searchOptions.ingredient}
        onChange={handleIngredientChange}
        id={ID_INPUT_INGREDIENT}
        InputProps={{ "data-testid": ID_INPUT_INGREDIENT }}
      />
      <Typography variant="body1">Rating</Typography>
      <Grid container>
        <Grid item>
          <NumericInput
            value={searchOptions.ratingMin}
            setValue={setRatingMin}
            errors={errors}
            valueName="Min"
            variant="outlined"
            validator={validateMin}
            data-testid={ID_INPUT_MIN_RATING}
            {...errorFuncs}
          />
        </Grid>
        <Grid item>
          <NumericInput
            value={searchOptions.ratingMax}
            setValue={setRatingMax}
            errors={errors}
            valueName={"Max"}
            variant="outlined"
            validator={validateMax}
            data-testid={ID_INPUT_MAX_RATING}
            {...errorFuncs}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

RecipeBrowserOptions.propTypes = {
  searchOptions: PropTypes.shape({
    ratingMin: PropTypes.number,
    ratingMax: PropTypes.number,
    ingredient: PropTypes.string,
  }),
  updateSearchOptions: PropTypes.func,
};
export { RecipeBrowserOptions, ids, errorMessages };
