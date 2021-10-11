import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Rating from "@material-ui/lab/Rating";
import PropTypes from "prop-types";
import React from "react";
const ID_RATING_SLIDER = "idRecipePage_RatingSlider";

const RecipeRating = ({ rating, editable, setRating }) => {
  return (
    <Grid container item xs={6} direction="column">
      <Grid item>
        <Typography variant="h5" gutterBottom>
          Rating
        </Typography>
      </Grid>
      <Grid item>
        <Rating
          name={ID_RATING_SLIDER}
          value={rating}
          readOnly={!editable}
          preciscion={0.5}
          onChange={(event, newRating) => setRating(newRating)}
        />
      </Grid>
    </Grid>
  );
};

RecipeRating.propTypes = {
  rating: PropTypes.number.isRequired,
  editable: PropTypes.bool.isRequired,
  setRating: PropTypes.func.isRequired,
};
export { RecipeRating };
