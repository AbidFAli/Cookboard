import { Button } from "@material-ui/core";
import MobileStepper from "@material-ui/core/MobileStepper";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import PropTypes from "prop-types";
import React, { useState } from "react";

const useStyles = makeStyles({
  photoTitle: {},
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
  },
  caption: {
    fontWeight: "bold",
  },
});

//const Photo = {url, title, caption}
const PhotoViewer = (props) => {
  const classes = useStyles();

  const [photos, setPhotos] = useState(props.photos ?? []);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  let maxPhotos = photos.length;

  const handleNext = () => {
    setCurrentPhoto(currentPhoto + 1);
  };

  const handleBack = () => {
    setCurrentPhoto(currentPhoto - 1);
  };

  //handle case of no photos
  return (
    <Paper>
      <Photo
        url={photos[currentPhoto].url}
        title={photos[currentPhoto].title}
        caption={photos[currentPhoto].caption}
        width={props.photoWidth}
        height={props.photoHeight}
      />
      <MobileStepper
        steps={photos.length}
        position="static"
        variant="dots"
        activeStep={currentPhoto}
        nextButton={
          <Button
            disabled={currentPhoto === maxPhotos - 1}
            onClick={handleNext}
          >
            Next
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button disabled={currentPhoto === 0} onClick={handleBack}>
            <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
    </Paper>
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
};

PhotoViewer.propTypes = {};
//https://www.w3schools.com/tags/tag_img.asp
const Photo = ({ url, title, caption, width, height }) => {
  const classes = useStyles();

  return (
    <div>
      {title && <Typography variant="h6">{title}</Typography>}
      <div className={classes.photoContainer}>
        {url && <img src={url} width={width} height={height} loading="lazy" />}
        {caption && <PhotoCaption caption={caption} />}
      </div>
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

export { PhotoViewer, Photo };
