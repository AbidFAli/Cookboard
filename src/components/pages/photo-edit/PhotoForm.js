import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import PropTypes from "prop-types";
import React, { useRef, useState } from "react";

const ids = {
  ID_FIELD_PHOTO_TITLE: "recipePhotoTitleField",
  ID_FIELD_PHOTO_CAPTION: "recipePhotoCaptionField",
  ID_BUTTON_DELETE_PHOTO: "recipeDeletePhotoButton",
  ID_BUTTON_ADD_PHOTO: "recipeAddPhotoButton",
  ID_INPUT_PHOTO_FILE: "recipeInputPhotoFile",
  ID_RECIPE_IMAGE: "recipeImage",
  ID_NEXT_BUTTON: "recipePhotoFormNextButton",
  ID_BACK_BUTTON: "recipePhotoFormBackButton",
  ID_BUTTON_SAVE_CHANGES: "recipePhotoSaveChangesButton",
};

const IMAGE_WIDTH = 400;
const IMAGE_HEIGHT = 400;
const PLACEHOLDER_URL = `https://via.placeholder.com/${IMAGE_WIDTH}x${IMAGE_HEIGHT}`;

const PhotoForm = ({ photos, modifyPhotos, photoLimit, savePhotos }) => {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const photoInputRef = useRef(null);
  let maxPhotos = photos.length;

  const handleNext = () => {
    setCurrentPhoto(currentPhoto + 1);
  };

  const handleBack = () => {
    setCurrentPhoto(currentPhoto - 1);
  };

  const handleFileSelected = () => {
    //using event.target.value wasn't working in tests(but was in browser?)

    if (
      photoInputRef.current.files.length > 0 &&
      photos.length === currentPhoto
    ) {
      //no existing photo for currentPhoto in photos array
      let file = photoInputRef.current.files[0];
      let newPhoto = {
        url: window.URL.createObjectURL(file),
        file,
        caption: "",
      };
      modifyPhotos({ type: "add", photo: newPhoto });
    } else if (
      photoInputRef.current.files.length > 0 &&
      photos.length > currentPhoto
    ) {
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
    if (photos[currentPhoto].url !== "") {
      window.URL.revokeObjectURL(photos[currentPhoto.url]); //dealloc url
    }
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
    setCurrentPhoto(photos.length);
  };

  let filePicker = (
    <Grid item>
      <label
        htmlFor={ids.ID_INPUT_PHOTO_FILE}
      >{`Upload an image(up to ${photoLimit})`}</label>
      <input
        type="file"
        id={ids.ID_INPUT_PHOTO_FILE}
        data-testid={ids.ID_INPUT_PHOTO_FILE}
        accept=".png,.jpeg,.jpg"
        onChange={(event) => handleFileSelected(event)}
        ref={photoInputRef}
      />
    </Grid>
  );
  let formControls = null;
  let imageBox = null;
  if (photos.length > 0) {
    formControls = (
      <React.Fragment>
        <Grid item>
          <TextField
            inputProps={{ "data-testid": ids.ID_FIELD_PHOTO_CAPTION }}
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
            disabled={
              photos.length === photoLimit ||
              (photos.length > 0 && photos[photos.length - 1].url === "")
            }
          >
            <AddIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <Button
            data-testid={ids.ID_NEXT_BUTTON}
            disabled={currentPhoto === maxPhotos - 1}
            onClick={handleNext}
          >
            Next
            <KeyboardArrowRight />
          </Button>
          <Typography variant="body1">{`${
            currentPhoto + 1
          } / ${maxPhotos}`}</Typography>
          <Button
            disabled={currentPhoto === 0}
            onClick={handleBack}
            data-testid={ids.ID_BACK_BUTTON}
          >
            <KeyboardArrowLeft />
            Back
          </Button>
        </Grid>
      </React.Fragment>
    );

    imageBox = (
      <img
        src={
          photos[currentPhoto].url ? photos[currentPhoto].url : PLACEHOLDER_URL
        }
        height={`${IMAGE_HEIGHT} px`}
        width={`${IMAGE_WIDTH} px`}
        data-testid={ids.ID_RECIPE_IMAGE}
      />
    );
  }

  return (
    <Grid container direction="column">
      {imageBox}
      {filePicker}
      {formControls}
      <Grid item>
        <Button
          data-testid={ids.ID_BUTTON_SAVE_CHANGES}
          onClick={savePhotos}
          disabled={
            photos.length > 0 &&
            !photos[currentPhoto].file &&
            !photos[currentPhoto].url
          }
        >
          Save Changes
        </Button>
      </Grid>
    </Grid>
  );
};

PhotoForm.propTypes = {
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      title: PropTypes.string,
      caption: PropTypes.string,
      file: PropTypes.oneOfType([
        PropTypes.instanceOf(File),
        PropTypes.instanceOf(Blob),
      ]),
    })
  ),
  modifyPhotos: PropTypes.func,
  snackbarRef: PropTypes.object,
  photoLimit: PropTypes.number,
  savePhotos: PropTypes.func,
};

PhotoForm.defaultProps = {
  photoLimit: 4,
};

export { PhotoForm, ids, PLACEHOLDER_URL };
