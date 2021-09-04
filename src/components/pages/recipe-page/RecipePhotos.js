import FastfoodIcon from "@material-ui/icons/Fastfood";
import PropTypes from "prop-types";
import React from "react";
import { PhotoViewer } from "../../PhotoViewer";
import { PhotoForm } from "./PhotoForm";

const ids = {};

const PHOTO_PLACEHOLDER_CAPTION = "This recipe has no photos";

const RecipePhotos = ({ photos, editable, modifyPhotos, snackbarRef }) => {
  let content;
  if (!editable) {
    content = (
      <PhotoViewer
        photos={photos}
        placeholderElement={<FastfoodIcon />}
        placeholderCaption={PHOTO_PLACEHOLDER_CAPTION}
      />
    );
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
