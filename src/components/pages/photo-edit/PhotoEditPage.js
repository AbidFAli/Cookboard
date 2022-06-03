import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import PropTypes from "prop-types";
import React, { useEffect, useReducer, useState } from "react";
import { useHistory } from "react-router";
import { Prompt } from "react-router-dom";
import { recipePhotoService } from "../../../services/recipePhotoService";
import recipeService from "../../../services/recipeService";
import { PhotoForm } from "./PhotoForm";
import { UploadProgress } from "./UploadProgress";

const useStyles = makeStyles({
  root: {
    marginTop: "5%",
    width: "100%",
    height: "80vh",
  },
});

const PHOTO_LIMIT = 4;

const messages = {
  PHOTOS_LOADED: "Photos loaded",
  LEAVE_UPLOAD: "Are you sure you want to leave without finishing your upload?",
};

const ids = {
  ID_BACK_BUTTON: "idGoBack",
};
/*
action:{
   type: 'add'||'edit'||'remove'||'clear'|| 'setAll'
   photo: the photo object
   index: index of photo to edit. only for type: 'edit'
   photos: the photos to add. only for type : "setAll"
}
photos: array of photo
*/
function reducePhotos(photos, action) {
  let newPhotos;
  switch (action.type) {
    case "add":
      newPhotos = [...photos];
      newPhotos.push(action.photo);
      break;
    case "edit":
      newPhotos = [...photos];
      newPhotos[action.index] = action.photo;
      break;
    case "remove":
      newPhotos = photos.filter((photo) => photo.url !== action.photo.url);
      break;
    case "clear":
      newPhotos = [];
      break;
    case "setAll":
      newPhotos = action.photos;
      break;
    default:
      throw new Error("Invalid action.type for reducePhotos");
  }
  return newPhotos;
}

//Photo = {url, key, caption, title, file}
const PhotoEditPage = ({ user, snackbarRef, recipeId }) => {
  const classes = useStyles();
  const history = useHistory();
  const [photos, dispatchPhotos] = useReducer(reducePhotos, []);
  const [progressStep, setProgressStep] = useState(0);
  const [maxStep, setMaxStep] = useState(1);
  const [progressVisible, setProgressVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    recipeService.getById(recipeId).then((recipe) => {
      dispatchPhotos({ type: "setAll", photos: recipe.photos });
      snackbarRef.current.displayMessage(messages.PHOTOS_LOADED);
    });
  }, []);

  //this is messy but i can't think of a way to refactor it right now
  const savePhotos = async () => {
    let metadata = [];
    let promises = [];
    setUploading(true);
    setProgressVisible(true);
    let maxStep = photos.length + 1;
    setMaxStep(photos.length + 1);
    let progressStep = 0;
    setProgressStep(progressStep);
    try {
      for (let i = 0; i < photos.length; i++) {
        let key = photos[i].key; //might be undefined if its a new photo, otherwise it already exists
        //case when uploading a new image or changing an exisitng one
        if (photos[i].file) {
          promises.push(
            recipePhotoService
              .saveImage(photos[i].file, recipeId, user)
              .then((key) => {
                metadata[i].key = key; //ensure keys will be set
                return;
              })
              .then(() => {
                progressStep += 1; //need this closure due to react state not updating instantly
                setProgressStep(progressStep);
              })
          );
        }
        metadata.push({ key, caption: photos[i].caption });
      }
      await Promise.all(promises); //wait for photo uploads and keys to be set
      await recipePhotoService.savePhotos(metadata, recipeId, user);
      setProgressStep(maxStep);
    } catch (error) {
      console.log("Error in uploading photos: " + error);
    } finally {
      setUploading(false);
    }
    return;
  };

  return (
    <div className={classes.root}>
      <Paper>
        <Prompt when={uploading} message={messages.LEAVE_UPLOAD} />
        <Grid>
          <PhotoForm
            photos={photos}
            modifyPhotos={dispatchPhotos}
            photoLimit={PHOTO_LIMIT}
            savePhotos={savePhotos}
          />
          {progressVisible && (
            <UploadProgress progress={100 * (progressStep / maxStep)} />
          )}
          <IconButton
            data-testid={ids.ID_BACK_BUTTON}
            onClick={() => history.goBack()}
          >
            <ArrowBackIcon />
          </IconButton>
        </Grid>
      </Paper>
    </div>
  );
};

PhotoEditPage.propTypes = {
  user: PropTypes.object.isRequired,
  //its a React ref
  snackbarRef: PropTypes.object,
  recipeId: PropTypes.string.isRequired,
};

export { PhotoEditPage, messages, ids };
