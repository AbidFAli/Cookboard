import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Rating from "@mui/lab/Rating";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
const ID_RATING_SLIDER = "idRecipePage_RatingSlider";
const ID_AVG_RATING = "idRecipePage_AverageRating";

const RecipeRating = ({ initialRating, avgRating, editable, onSave }) => {
  const [rating, setRating] = useState(initialRating);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  return (
    <Grid container item xs={6} direction="column">
      <Grid item>
        <Typography variant="h5" gutterBottom>
          Your Rating
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

        {rating !== initialRating && (
          <Button onClick={() => onSave(rating)}>Save</Button>
        )}
      </Grid>
      <Grid item>
        <Typography variant="h5" gutterBottom>
          Average
        </Typography>
        <Rating name={ID_AVG_RATING} value={avgRating} readOnly={true} />
        <Typography variant="body1">{avgRating}</Typography>
      </Grid>
    </Grid>
  );
};

RecipeRating.propTypes = {
  initialRating: PropTypes.number.isRequired,
  editable: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired, //onSave = (newRating) => something
  avgRating: PropTypes.number.isRequired,
};
export { RecipeRating, ID_RATING_SLIDER, ID_AVG_RATING };
