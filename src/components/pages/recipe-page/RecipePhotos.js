import FastfoodIcon from "@material-ui/icons/Fastfood";
import PropTypes from "prop-types";
import React from "react";
import { PhotoViewer } from "../../PhotoViewer";
import { PhotoForm } from "./PhotoForm";

const ids = {};

const PHOTO_PLACEHOLDER_CAPTION = "This recipe has no photos";

const RecipePhotos = ({
  photos,
  recipeCreated,
  editable,
  modifyPhotos,
  snackbarRef,
  savePhotos,
}) => {
  let content = null;
  if (!editable) {
    content = (
      <PhotoViewer
        photos={photos}
        placeholderElement={<FastfoodIcon />}
        placeholderCaption={PHOTO_PLACEHOLDER_CAPTION}
      />
    );
  } else if (recipeCreated) {
    content = (
      <PhotoForm
        photos={photos}
        modifyPhotos={modifyPhotos}
        snackbarRef={snackbarRef}
        savePhotos={savePhotos}
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
  recipeCreated: PropTypes.bool,
  savePhotos: PropTypes.func.isRequired,
};

export { RecipePhotos, ids };
