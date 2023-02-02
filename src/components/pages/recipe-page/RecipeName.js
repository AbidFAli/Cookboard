import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import React from "react";
import { ErrorMessenger } from "../../../Model/errorMessenger";

const ERROR_RECIPE_NAME = "errorKeyRecipeName";
const ERROR_MSG_RECIPE_NAME_MISSING = "Recipe name is required";

const ID_FIELD_RECIPE_NAME = "fieldRecipeName";

const RecipeName = ({
  recipeName,
  setRecipeName,
  editable,
  errors,
  dispatchErrors,
}) => {
  const handleChangeRecipeName = (newName) => {
    if (newName.trim() === "") {
      dispatchErrors({
        type: "add",
        errorKey: ERROR_RECIPE_NAME,
        errorMessage: ERROR_MSG_RECIPE_NAME_MISSING,
      });
    } else {
      dispatchErrors({ type: "remove", errorKey: ERROR_RECIPE_NAME });
    }
    setRecipeName(newName);
  };

  if (editable) {
    return (
      <TextField
        variant="standard"
        inputProps={{ "data-testid": ID_FIELD_RECIPE_NAME }}
        defaultValue={recipeName != null ? recipeName : ""}
        error={errors.hasError(ERROR_RECIPE_NAME)}
        helperText={errors.getErrorMessage(ERROR_RECIPE_NAME)}
        label="Recipe Name"
        onChange={(event) => handleChangeRecipeName(event.target.value)}
        required={true} />
    );
  } else {
    return <Typography variant="h2">{recipeName}</Typography>;
  }
};

RecipeName.propTypes = {
  recipeName: PropTypes.string,
  setRecipeName: PropTypes.func,
  editable: PropTypes.bool,
  errors: PropTypes.instanceOf(ErrorMessenger),
  dispatchErrors: PropTypes.func,
};

export {
  RecipeName,
  ERROR_RECIPE_NAME,
  ERROR_MSG_RECIPE_NAME_MISSING,
  ID_FIELD_RECIPE_NAME,
};
