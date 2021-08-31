import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import CancelIcon from "@material-ui/icons/Cancel";
import EditIcon from "@material-ui/icons/Edit";
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
  changeEditable,
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

  const createEditButton = function () {
    return (
      <Fab
        data-testid={ID_EDIT_BUTTON}
        color="primary"
        onClick={() => changeEditable()}
      >
        <EditIcon />
      </Fab>
    );
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
        onClick={() => changeEditable()}
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
        <Fab
          data-testid={ID_EDIT_BUTTON}
          color="primary"
          onClick={() => changeEditable()}
        >
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
      <Grid container item xs={12} md={6} justify="flex-end">
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
  changeEditable: PropTypes.func.isRequired,
};

export { ids, RecipePageButtons };
