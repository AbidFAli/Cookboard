import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import Grid from "@mui/material/Grid";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import PropTypes from "prop-types";
import React from "react";

const ID_EDIT_BUTTON = "idRecipePage_editButton";
const ID_CANCEL_BUTTON = "idRecipePage_cancelEditsButton";
const ID_SAVE_BUTTON = "idRecipePage_saveButton";
const ID_DELETE_BUTTON = "idRecipePage_deleteButton";

const ids = {
  ID_EDIT_BUTTON,
  ID_CANCEL_BUTTON,
  ID_SAVE_BUTTON,
  ID_DELETE_BUTTON,
};

const RecipePageButtons = ({
  ownerId,
  user,
  editable,
  created,
  errors,
  handleUpdate,
  handleCreate,
  handleDeleteRecipe,
  cancelEdits,
  beginEdits,
}) => {
  const createDeleteButton = function () {
    let deleteButton = null;

    deleteButton = (
      <Button
        onClick={handleDeleteRecipe}
        data-testid={ID_DELETE_BUTTON}
        variant="outlined"
        color="primary"
      >
        Delete Recipe
      </Button>
    );
    return deleteButton;
  };

  let saveButton = null;
  let deleteButton = null;
  let floatingActionButton = null;
  if (editable) {
    saveButton = (
      <Button
        variant="outlined"
        color="primary"
        onClick={() => (created ? handleUpdate() : handleCreate())}
        disabled={errors.size() !== 0}
        data-testid={ID_SAVE_BUTTON}
      >
        {created ? "Save Changes" : "Create Recipe"}
      </Button>
    );

    floatingActionButton = (
      <Fab
        data-testid={ID_CANCEL_BUTTON}
        color="secondary"
        onClick={cancelEdits}
      >
        <CancelIcon />
      </Fab>
    );
  }

  if (user && user.id && user.id === ownerId) {
    if (created) {
      deleteButton = createDeleteButton();
    }

    if (!editable) {
      floatingActionButton = (
        <Fab data-testid={ID_EDIT_BUTTON} color="primary" onClick={beginEdits}>
          <EditIcon />
        </Fab>
      );
    }
  }

  return (
    <React.Fragment>
      <Grid container item xs={12} md={6} spacing={2}>
        <Grid item>{floatingActionButton}</Grid>
        <Grid item>{saveButton}</Grid>
      </Grid>
      <Grid container item xs={12} md={6} justifyContent="flex-end">
        <Grid item>{deleteButton}</Grid>
      </Grid>
    </React.Fragment>
  );
};

RecipePageButtons.propTypes = {
  ownerId: PropTypes.string,
  user: PropTypes.object,
  editable: PropTypes.bool.isRequired,
  created: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleCreate: PropTypes.func.isRequired,
  handleDeleteRecipe: PropTypes.func.isRequired,
  cancelEdits: PropTypes.func.isRequired,
  beginEdits: PropTypes.func.isRequired,
};

export { ids, RecipePageButtons };
