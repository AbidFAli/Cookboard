import Button from "@material-ui/core/Button";
import FastfoodIcon from "@material-ui/icons/Fastfood";
import PropTypes from "prop-types";
import React from "react";
import { useHistory } from "react-router";
import { PhotoViewer } from "../../PhotoViewer";

const ids = {};

const PHOTO_PLACEHOLDER_CAPTION = "This recipe has no photos";

const RecipePhotos = ({
  photos,
  recipeCreated,
  editable,
  saveEditedFields,
}) => {
  const history = useHistory();
  let content = null;

  const navigateToPhotoEditPage = () => {
    saveEditedFields();
    history.push(`${history.location.pathname}/photos/edit`);
  };
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
      <Button onClick={navigateToPhotoEditPage}>Click me to add photos</Button>
    );
  }
  return <div>{content}</div>;
};

RecipePhotos.propTypes = {
  editable: PropTypes.bool,
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      title: PropTypes.string,
      caption: PropTypes.string,
    })
  ),
  recipeCreated: PropTypes.bool,
  saveEditedFields: PropTypes.func,
};

export { RecipePhotos, ids };
