import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import breakfastPic from "../../../images/breakfast.jpg";
import dinnerPic from "../../../images/dinner.jpg";
import backgroundPic from "../../../images/homepage_background.jpg";
import lunchPic from "../../../images/lunch.jpg";
import { PhotoViewer } from "../../PhotoViewer";

const useStyles = makeStyles({
  root: {
    backgroundImage: `url(${backgroundPic})`,
    backgroundSize: "cover",
  },
});

const photos = [
  { url: breakfastPic, caption: "See breakfast recipes" },
  { url: lunchPic, caption: "See lunch recipes" },
  { url: dinnerPic, caption: "See dinner recipes" },
];
const HomePage = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={2}
        justify="center"
        alignItems="center"
        direction="column"
      >
        <Grid item>
          <Typography variant="h1">Cookboard</Typography>
        </Grid>
        <Grid item>
          <PhotoViewer photoWidth={600} photoHeight={450} photos={photos} />
        </Grid>
      </Grid>
    </div>
  );
};

HomePage.propTypes = {};

export { HomePage };
