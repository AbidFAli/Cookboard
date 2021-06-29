import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const ERROR_RECIPE_NAME = "errorKeyRecipeName"
const ERROR_MSG_RECIPE_NAME_MISSING = "Recipe name is required"

const ID_FIELD_RECIPE_NAME = "fieldRecipeName"
const RecipeName = ({recipeName, setRecipeName, editable, errors, dispatchErrors}) => {
  const handleChangeRecipeName = (newName) => {
      if(newName.trim() === ''){
          dispatchErrors({type: 'add', errorKey: ERROR_RECIPE_NAME, errorMessage: ERROR_MSG_RECIPE_NAME_MISSING})
      }
      else{
          dispatchErrors({type: 'remove', errorKey: ERROR_RECIPE_NAME})
      }
      setRecipeName(newName)
  }

  if(editable){
      return (
          <TextField
              inputProps = { {'data-testid' : ID_FIELD_RECIPE_NAME} }
              defaultValue= {recipeName != null ? recipeName : ''}
              error = {errors.hasError(ERROR_RECIPE_NAME)}
              helperText = {errors.getErrorMessage(ERROR_RECIPE_NAME)}
              label = "Recipe Name"
              onChange = {(event) => handleChangeRecipeName(event.target.value)}
              required = {true}
          />
      )
  }
  else{
      return (
          <Typography variant="h2">
              {recipeName}
          </Typography>
      )
  }
}

export {
    RecipeName,
    ERROR_RECIPE_NAME,
    ERROR_MSG_RECIPE_NAME_MISSING,
    ID_FIELD_RECIPE_NAME
};
