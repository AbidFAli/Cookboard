import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/grid";
import IconButton from "@material-ui/core/IconButton";
import MobileStepper from "@material-ui/core/MobileStepper";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import { PhotoViewer } from "../../PhotoViewer";
const ids = {
  ID_FIELD_PHOTO_TITLE: "recipePhotoTitleField",
  ID_FIELD_PHOTO_CAPTION: "recipePhotoCaptionField",
  ID_BUTTON_DELETE_PHOTO: "recipeDeletePhotoButton",
  ID_BUTTON_ADD_PHOTO: "recipeAddPhotoButton",
};

const IMAGE_WIDTH = 400;
const IMAGE_HEIGHT = 400;

const PhotoForm = ({ photos, modifyPhotos, snackbarRef }) => {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const photoInputRef = useRef(null);
  let maxPhotos = photos.length;

  const handleNext = () => {
    setCurrentPhoto(currentPhoto + 1);
  };

  const handleBack = () => {
    setCurrentPhoto(currentPhoto - 1);
  };

  //todo: case of double selected file
  const handleFileSelected = (event) => {
    if (event.target.value !== "" && photos.length === currentPhoto) {
      //no existing photo for currentPhoto in photos array
      let file = photoInputRef.current.files[0];
      let newPhoto = {
        url: window.URL.createObjectURL(file),
        file,
        caption: "",
      };
      modifyPhotos({ type: "add", photo: newPhoto });
    } else if (event.target.value !== "" && photos.length > currentPhoto) {
      //exisitng photo for currentPhoto in photos array
      let file = photoInputRef.current.files[0];
      let newPhoto = { ...photos[currentPhoto] };
      if (photos[currentPhoto].url) {
        window.URL.revokeObjectURL(photos[currentPhoto].url);
      }
      newPhoto.url = window.URL.createObjectURL(file);
      newPhoto.file = file;
      modifyPhotos({ type: "edit", index: currentPhoto, photo: newPhoto });
    }
  };
  const handleCaptionChange = (event) => {
    if (event.target.value !== "" && photos.length === currentPhoto) {
      //no existing photo for currentPhoto in photos array
      let newPhoto = {
        url: "",
        file: null,
        caption: event.target.value,
      };
      modifyPhotos({ type: "add", photo: newPhoto });
    } else if (event.target.value !== "" && photos.length > currentPhoto) {
      //exisitng photo for currentPhoto in photos array
      let newPhoto = { ...photos[currentPhoto] };
      newPhoto.caption = event.target.value;
      modifyPhotos({ type: "edit", index: currentPhoto, photo: newPhoto });
    }
  };
  const handleDeletePhoto = () => {
    modifyPhotos({ type: "remove", photo: photos[currentPhoto] });
    setCurrentPhoto(currentPhoto - 1 < 0 ? 0 : currentPhoto - 1);
  };
  const handleAddPhoto = () => {
    let newPhoto = {
      url: "",
      file: null,
      caption: "",
    };
    modifyPhotos({ type: "add", photo: newPhoto });
    setCurrentPhoto(currentPhoto + 1);
  };

  let filePicker = (
    <Grid item>
      <label htmlFor="photoImg">Upload an image</label>
      <input
        type="file"
        id="photoImg"
        accept="image/*"
        onChange={(event) => handleFileSelected(event)}
        ref={photoInputRef}
      />
    </Grid>
  );
  let rest = null;
  let imageBox = null;
  if (photos.length > 0) {
    rest = (
      <React.Fragment>
        <Grid item>
          <TextField
            inputProps={{ "data-testid": ids.ID_FIELD_PHOTO_TITLE }}
            label="Photo Caption"
            onChange={(event) => handleCaptionChange(event)}
          />
        </Grid>
        <Grid item>
          <IconButton
            data-testid={ids.ID_BUTTON_DELETE_PHOTO}
            onClick={handleDeletePhoto}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            data-testid={ids.ID_BUTTON_ADD_PHOTO}
            onClick={handleAddPhoto}
          >
            <AddIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <MobileStepper
            steps={photos.length}
            position="static"
            variant="text"
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
        </Grid>
      </React.Fragment>
    );

    imageBox = (
      <img
        src={
          photos[currentPhoto].url !== ""
            ? photos[currentPhoto].url
            : `https://via.placeholder.com/${IMAGE_WIDTH}x${IMAGE_HEIGHT}`
        }
        height={`${IMAGE_HEIGHT} px`}
        width={`${IMAGE_WIDTH} px`}
      />
    );
  }

  return (
    <Grid container direction="column">
      {imageBox}
      {filePicker}
      {rest}
    </Grid>
  );
};

PhotoForm.propTypes = {
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string,
      caption: PropTypes.string,
    })
  ),
  modifyPhotos: PropTypes.func,
  snackbarRef: PropTypes.object,
};

const RecipePhotos = ({ photos, editable, modifyPhotos, snackbarRef }) => {
  let content;
  if (!editable) {
    content = <PhotoViewer photos={photos} />;
  } else {
    content = (
      <PhotoForm
        photos={photos}
        modifyPhotos={modifyPhotos}
        snackbarRef={snackbarRef}
      />
    );
  }
  return content;
};

RecipePhotos.propTypes = {
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string,
      caption: PropTypes.string,
    })
  ),
  editable: PropTypes.bool,
  modifyPhotos: PropTypes.func,
  snackbarRef: PropTypes.object,
};

export { RecipePhotos, ids };
