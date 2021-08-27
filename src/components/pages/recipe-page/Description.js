import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import React from "react";

const ID_FIELD_DESCRIPTION = "fieldDescription";

/*
 *@param props = {
 *  desc: recipe description; string
 *  stars: number of recipe stars; number
 * }
 */
const Description = ({ editable, desc, setDesc }) => {
  const handleChangeDesc = (newDesc) => {
    setDesc(newDesc);
  };
  let viewDescription;
  if (editable) {
    viewDescription = (
      <TextField
        inputProps={{ "data-testid": ID_FIELD_DESCRIPTION }}
        name="fieldDescription"
        label="Description"
        value={desc}
        onChange={(event) => handleChangeDesc(event.target.value)}
      />
    );
  } else {
    viewDescription = (
      <Typography data-testid={ID_FIELD_DESCRIPTION} variant="body1">
        {desc}
      </Typography>
    );
  }
  return (
    <Grid container>
      <Grid item xs={6}>
        {viewDescription}
      </Grid>
    </Grid>
  );
};

Description.propTypes = {
  editable: PropTypes.bool,
  desc: PropTypes.string,
  setDesc: PropTypes.func,
};

export { Description, ID_FIELD_DESCRIPTION };
