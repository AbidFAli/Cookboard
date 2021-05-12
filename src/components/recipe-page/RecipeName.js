import React from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const RecipeName = ({recipeName, setRecipeName, editable}) => {
  const handleChangeRecipeName = (newName) => {
      setRecipeName(newName)
  }

  if(editable){
      return (
          <TextField
              name = "fieldRecipeName"
              defaultValue= {recipeName != null ? recipeName : ''}
              label = "Recipe Name"
              onChange = {(event) => handleChangeRecipeName(event.target.value)}
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

export default RecipeName;