import { Button, Paper } from "@material-ui/core";
import MobileStepper from "@material-ui/core/MobileStepper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import PropTypes from "prop-types";
import React, { useState } from "react";

const ids = {
  BUTTON_NEXT_PHOTO: "buttonNextPhoto",
  BUTTON_PREV_PHOTO: "buttonPrevPhoto",
};
const useStyles = makeStyles({
  captionContainer: {
    backgroundColor: "rgba(255, 255, 255,.3)",
    position: "absolute",
    height: "10%",
    width: "100%",
    bottom: "0",
  },
  photoContainer: {
    position: "relative",
    marginBottom: "0",
    width: "100%",
  },
  caption: {
    fontWeight: "bold",
  },
  componentContainer: {
    width: "50%",
  },
});

//const Photo = {url, title, caption}
const PhotoViewer = (props) => {
  const classes = useStyles();
  const [currentPhoto, setCurrentPhoto] = useState(0);
  let maxPhotos = props.photos.length;

  const handleNext = () => {
    setCurrentPhoto(currentPhoto + 1);
  };

  const handleBack = () => {
    setCurrentPhoto(currentPhoto - 1);
  };

  let content = null;
  if (props.photos.length > 0) {
    content = (
      <React.Fragment>
        <Photo
          url={props.photos[currentPhoto].url}
          title={props.photos[currentPhoto].title}
          caption={props.photos[currentPhoto].caption}
          width={props.photoWidth}
          height={props.photoHeight}
        />
        <MobileStepper
          steps={props.photos.length}
          position="static"
          variant="dots"
          activeStep={currentPhoto}
          nextButton={
            <Button
              disabled={currentPhoto === maxPhotos - 1}
              data-testid={ids.BUTTON_NEXT_PHOTO}
              onClick={handleNext}
            >
              Next
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button
              disabled={currentPhoto === 0}
              onClick={handleBack}
              data-testid={ids.BUTTON_PREV_PHOTO}
            >
              <KeyboardArrowLeft />
              Back
            </Button>
          }
        />
      </React.Fragment>
    );
  } else if (props.placeholderImage) {
    content = (
      <React.Fragment>
        <Photo url={props.placeholderImage} />
        <Typography align={"center"}>{props.placeholderCaption}</Typography>
      </React.Fragment>
    );
  }
  return (
    <div className={classes.componentContainer}>
      <Paper>{content}</Paper>
    </div>
  );
};

PhotoViewer.propTypes = {
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string,
      caption: PropTypes.string,
    })
  ),
  photoWidth: PropTypes.number,
  photoHeight: PropTypes.number,
  placeholderImage: PropTypes.string, //url to the placeholder image
  placeholderCaption: PropTypes.string,
};

PhotoViewer.defaultProps = {
  photos: [],
};

PhotoViewer.propTypes = {};
//https://www.w3schools.com/tags/tag_img.asp
const Photo = ({ url, title, caption, width, height }) => {
  const classes = useStyles();

  return (
    <div className={classes.photoContainer}>
      {title && <Typography variant="h6">{title}</Typography>}
      {url && <img src={url} loading="lazy" />}
      {caption && <PhotoCaption caption={caption} />}
    </div>
  );
};

Photo.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  caption: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

const PhotoCaption = ({ caption }) => {
  const classes = useStyles();

  return (
    <div className={classes.captionContainer}>
      <Typography
        variant="subtitle2"
        color="textPrimary"
        display="block"
        align="center"
      >
        {caption}
      </Typography>
    </div>
  );
};

PhotoCaption.propTypes = {
  caption: PropTypes.string,
};

export { PhotoViewer, Photo, ids };
