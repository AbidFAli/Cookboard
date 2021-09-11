import FastfoodIcon from "@material-ui/icons/Fastfood";
import PropTypes from "prop-types";
import React from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { PhotoViewer } from "../../PhotoViewer";

const ids = {};

const PHOTO_PLACEHOLDER_CAPTION = "This recipe has no photos";

const RecipePhotos = ({
  photos,
  recipeCreated,
  editable,
  snackbarRef,
  recipeId,
}) => {
  const history = useHistory();
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
      <Link
        to={{
          pathname: `${history.location.pathname}/photos/edit`,
        }}
      >
        Click me to add photos
      </Link>
    );
  }
  return <div>{content}</div>;
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
  snackbarRef: PropTypes.object,
  recipeCreated: PropTypes.bool,
  recipeId: PropTypes.string,
};

export { RecipePhotos, ids };
