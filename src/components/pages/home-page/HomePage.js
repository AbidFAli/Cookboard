import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import breakfastPic from "../../../images/breakfast.jpg";
import dinnerPic from "../../../images/dinner.jpg";
import backgroundPic from "../../../images/homepage_background.jpg";
import lunchPic from "../../../images/lunch.jpg";
import { PhotoViewer } from "../../PhotoViewer";

const useStyles = makeStyles({
  root: {
    marginTop: "5%",
    backgroundImage: `url(${backgroundPic})`,
    height: "80vh",
    outlineStyle: "solid",
  },
  photoViewer: {
    marginTop: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "40vh",
    width: "40vw",
    maxWidth: "60vw",
    "& img": {
      width: "100%",
      height: "40vh",
    },
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
    <div className={classes.outline}>
      <div className={classes.root}>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          direction="column"
        >
          <Grid item>
            <Typography variant="h1">Cookboard</Typography>
          </Grid>
          <Grid item>
            <div className={classes.photoViewer}>
              <PhotoViewer photos={photos} />
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

HomePage.propTypes = {};

export { HomePage };
