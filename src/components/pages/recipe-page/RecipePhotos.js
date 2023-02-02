import Button from "@mui/material/Button";
import { styled } from "@mui/styles";
import PropTypes from "prop-types";
import React from "react";
import { useHistory } from "react-router";
import fastfoodPic from "../../../images/fastfood_black_48dp.svg";
import { PhotoViewer } from "../../PhotoViewer";

const ids = {};

const PHOTO_PLACEHOLDER_CAPTION = "This recipe has no photos";

const PhotoContainer = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "& img": {
    width: "100%",
    height: "40vh",
  },
}));

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
        placeholderImage={fastfoodPic}
        placeholderCaption={PHOTO_PLACEHOLDER_CAPTION}
      />
    );
  } else if (recipeCreated) {
    content = (
      <Button onClick={navigateToPhotoEditPage}>Click me to add photos</Button>
    );
  }
  return <PhotoContainer>{content}</PhotoContainer>;
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
