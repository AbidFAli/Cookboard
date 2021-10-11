import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { cloneDeep } from "lodash";
import PropTypes from "prop-types";
import React, { useEffect, useReducer, useState } from "react";
import { useHistory } from "react-router";
import { ErrorMessenger, reduceErrors } from "../../../Model/errorMessenger";
import { Ingredient } from "../../../Model/ingredient";
import Instruction from "../../../Model/instruction";
import { PATH_LOGIN, PATH_MYRECIPES, PATH_RECIPES } from "../../../paths";
import { recipePhotoService } from "../../../services/recipePhotoService";
import recipeService from "../../../services/recipeService";
import { isTokenExpiredError } from "../../../util/errors";
import { IngredientList } from "./IngredientList";
import { InstructionList } from "./InstructionList";
import { RecipeDescription } from "./RecipeDescription";
import { RecipeName } from "./RecipeName";
import { ids as buttonIds, RecipePageButtons } from "./RecipePageButtons";
import { RecipePhotos } from "./RecipePhotos";
import { RecipeRating } from "./RecipeRating";
import { ServingInfoList } from "./ServingInfoList";
import { TimingInfo } from "./TimingInfo";

const TEXT_CONFIRM_DELETE = "Are you sure you want to delete this recipe?";
const KEY_RECIPE_BEFORE_EDITS = "keyRecipeBeforeEdits";
const KEY_RECIPE_EDITED_FIELDS = "KeyRecipeEditedFields";

const MESSAGE_RECIPE_LOADED = "Recipe loaded.";
const MESSAGE_TOKEN_EXPIRED =
  "It has been too long since your last login. Please log in again.";

//moved these ids to the RecipePageButtons but i dont want to fix the import issues in other files
const ID_EDIT_BUTTON = buttonIds.ID_EDIT_BUTTON;
const ID_CANCEL_BUTTON = buttonIds.ID_CANCEL_BUTTON;
const ID_SAVE_BUTTON = buttonIds.ID_SAVE_BUTTON;
const ID_DELETE_BUTTON = buttonIds.ID_DELETE_BUTTON;

/*
*action:{
  type: 'add'|'edit'|'remove'|'setAll'
  index: the index of the instruction to edit/remove; only for action.type = 'edit' || 'remove'
  text: the text of the new instruction; only for action.type = 'edit'
  instructions: the instructions to be set; only for action.type = 'setAll'
}
*/
function reduceInstructions(instructions, action) {
  let newInstructions = Array.from(instructions);
  switch (action.type) {
    case "add":
      newInstructions.push(new Instruction(action.text));
      break;
    case "remove":
      newInstructions.splice(action.index, 1);
      break;
    case "edit":
      newInstructions[action.index].text = action.text;
      break;
    case "setAll":
      newInstructions = action.instructions;
      break;
    default:
      throw new Error("Invalid action.type for reduceIngredients");
  }
  return newInstructions;
}

/*
action: {
  type: 'add'||'edit'||'remove'||'setAll'
  ingredient: ingredient to be added/removed or the edited ingredient
  ingredients: array of ingredients to be set; only for action.type = 'setAll'
}
*/
function reduceIngredients(ingredients, action) {
  let newIngredients;
  switch (action.type) {
    case "add":
      newIngredients = [...ingredients];
      newIngredients.push(action.ingredient);
      break;
    case "edit":
      newIngredients = ingredients.map((ingredient) =>
        ingredient.id === action.ingredient.id ? action.ingredient : ingredient
      );
      break;
    case "remove":
      newIngredients = ingredients.filter(
        (ingredient) => ingredient.id !== action.ingredient.id
      );
      break;
    case "setAll":
      newIngredients = action.ingredients;
      break;
    default:
      throw new Error("Invalid action.type for reduceIngredients");
  }
  return newIngredients;
}

/*
 *@prop id: the id of the recipe to display;
 *  @type null || string
 *@prop user: the logged in user
 *  @type User || null
 *@prop snackbarRef
 */
const RecipePage = (props) => {
  const history = useHistory();
  const [errors, dispatchErrors] = useReducer(
    reduceErrors,
    new ErrorMessenger()
  );

  //recipe state, editable by user on this page
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, modifyInstructions] = useReducer(reduceInstructions, []);
  const [ingredients, modifyIngredients] = useReducer(reduceIngredients, []);
  const [rating, setRating] = useState(0);
  const [timeToMake, setTimeToMake] = useState(null);
  const [servingInfo, setServingInfo] = useState(null);
  //recipe state, uneditable by user on this page
  const [photos, setPhotos] = useState([]);
  const [ownerId, setOwnerId] = useState(undefined);

  //page control state

  //whether the page is currently in editing mode
  const [editable, setEditable] = useState(
    props.id == null && props.user != null
  );
  //whether the recipe has been created or not
  const [created, setCreated] = useState(props.id != null);

  useEffect(() => {
    if (props.id) {
      recipeService.getById(props.id).then((recipe) => {
        props.snackbarRef.current.displayMessage(MESSAGE_RECIPE_LOADED);
        let oldRecipeJSON = window.sessionStorage.getItem(
          KEY_RECIPE_EDITED_FIELDS
        );
        window.sessionStorage.removeItem(KEY_RECIPE_EDITED_FIELDS);
        if (oldRecipeJSON && history.action === "POP") {
          let oldRecipe = JSON.parse(oldRecipeJSON);
          oldRecipe.photos = recipe.photos;
          setPageState(oldRecipe);
          setEditable(true);
        } else {
          setPageState(recipe);
        }
      });
    }
  }, [props.id]);

  const handleRecipeServiceError = (error) => {
    if (isTokenExpiredError(error)) {
      history.push(PATH_LOGIN);
      props.snackbarRef.current.displayMessage(MESSAGE_TOKEN_EXPIRED);
    } else {
      console.log(error);
    }
  };

  const handleDeleteRecipe = async () => {
    try {
      if (window.confirm(TEXT_CONFIRM_DELETE)) {
        await recipeService.destroy(props.id, props.user);
        history.push(PATH_MYRECIPES);
      }
    } catch (error) {
      handleRecipeServiceError(error);
    }
  };

  const getRecipeStateToSave = () => {
    let newRecipe = {
      name: name.trim(),
      description,
      rating,
      timeToMake,
      servingInfo,
      instructions: instructions.map((instr) => instr.text),
      ingredients: cloneDeep(ingredients),
    };
    if (props.id) {
      newRecipe.id = props.id;
    }

    //get rid of ids for any ingredients with temporary ids
    newRecipe.ingredients.forEach((ingredient) => {
      if (Ingredient.hasTempId(ingredient)) {
        delete ingredient.id;
      }
    });

    return newRecipe;
  };

  const handleUpdate = async () => {
    if (errors.size() === 0) {
      let newRecipe = getRecipeStateToSave();
      try {
        newRecipe = await recipeService.update(newRecipe, props.user);
        setPageState(newRecipe);
        setEditable(false);
      } catch (error) {
        handleRecipeServiceError(error);
      }
    }
  };

  const handleCreate = async () => {
    if (errors.size() === 0) {
      let newRecipe = getRecipeStateToSave();
      try {
        newRecipe = await recipeService.create(newRecipe, props.user);
        setCreated(true);
        history.replace(`${PATH_RECIPES}/${newRecipe.id}`);
        setEditable(false);
      } catch (error) {
        handleRecipeServiceError(error);
      }
    }
  };

  const setPageState = (recipe) => {
    setName(recipe != null && recipe.name != null ? recipe.name : "");
    setDescription(
      recipe != null && recipe.description != null ? recipe.description : ""
    );
    let newInstructions = [];
    if (recipe != null && recipe.instructions != null) {
      newInstructions = recipe.instructions.map(
        (text) => new Instruction(text)
      );
    }
    modifyInstructions({ type: "setAll", instructions: newInstructions });
    let newIngredients =
      recipe != null && recipe.ingredients != null ? recipe.ingredients : [];
    modifyIngredients({ type: "setAll", ingredients: newIngredients });
    setRating(recipe != null && recipe.rating != null ? recipe.rating : 0);
    setTimeToMake(recipe != null ? recipe.timeToMake : null);
    setServingInfo(recipe != null ? recipe.servingInfo : null);
    setOwnerId(recipe != null && recipe.user != null ? recipe.user : undefined);
    if (recipe != null && recipe.photos != null) {
      setPhotos(recipe.photos);
    }
  };

  /*
  Key: key in session storage where recipe is saved
  */
  const restoreRecipe = async (key) => {
    let oldRecipe = window.sessionStorage.getItem(key);
    oldRecipe = JSON.parse(oldRecipe);
    setPageState(oldRecipe);
  };

  /*
   *Key: key in session storage where recipe is saved
   */
  const saveRecipeLocally = (key) => {
    let recipeToSave = {
      id: props.id,
      name,
      description,
      instructions: instructions.map((instr) => instr.text),
      ingredients,
      rating,
      timeToMake,
      servingInfo,
      user: ownerId,
      photos: photos,
    };
    let recipeData = JSON.stringify(recipeToSave);
    window.sessionStorage.setItem(key, recipeData);
  };

  const cancelEdits = async () => {
    dispatchErrors({ type: "reset" });
    window.sessionStorage.removeItem(KEY_RECIPE_EDITED_FIELDS);
    if (created && editable) {
      await restoreRecipe(KEY_RECIPE_BEFORE_EDITS);
    } else if (!created && editable) {
      history.push(PATH_MYRECIPES);
    }
    setEditable(false);
  };

  const beginEdits = () => {
    dispatchErrors({ type: "reset" });
    if (created && !editable) {
      saveRecipeLocally(KEY_RECIPE_BEFORE_EDITS);
    }
    setEditable(true);
  };

  const handleSavePhoto = async () => {
    for (const photo of photos) {
      //this is async but im not waiting
      recipePhotoService.performSave(photo.file, props.id, props.user);
    }
  };

  //saves the contents of
  const saveEditedFields = () => {
    saveRecipeLocally(KEY_RECIPE_EDITED_FIELDS);
  };

  //functions for creating UI components

  return (
    <Grid container spacing={4}>
      <Grid
        container
        item
        xs={12}
        spacing={3}
        justifyContent="space-between"
        alignItems="flex-end"
      >
        <Grid item>
          <RecipeName
            recipeName={name}
            setRecipeName={setName}
            editable={editable}
            errors={errors}
            dispatchErrors={dispatchErrors}
          />
        </Grid>
        <Grid item>
          <TimingInfo
            timeToMake={timeToMake}
            setTimeToMake={setTimeToMake}
            editable={editable}
            errors={errors}
            dispatchErrors={dispatchErrors}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <RecipePhotos
          photos={photos}
          editable={editable}
          recipeCreated={created}
          savePhotos={handleSavePhoto}
          saveEditedFields={saveEditedFields}
        />
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <Grid container item xs={12} direction="row">
            <RecipeDescription
              desc={description}
              setDesc={setDescription}
              editable={editable}
            />
            <RecipeRating
              rating={rating}
              editable={editable}
              setRating={setRating}
            />
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <Typography variant="h5" gutterBottom>
            Ingredients
          </Typography>
          <IngredientList
            ingredients={ingredients}
            editable={editable}
            modifyIngredients={modifyIngredients}
            dispatchErrors={dispatchErrors}
          />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <ServingInfoList
          servingInfo={servingInfo}
          setServingInfo={setServingInfo}
          editable={editable}
          errors={errors}
          dispatchErrors={dispatchErrors}
        />
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <Typography variant="h5" gutterBottom>
            Instructions
          </Typography>
          <InstructionList
            instructions={instructions}
            editable={editable}
            modifyInstructions={modifyInstructions}
            dispatchErrors={dispatchErrors}
          />
        </Paper>
      </Grid>
      <Grid container item xs={12}>
        <RecipePageButtons
          ownerId={ownerId}
          user={props.user}
          editable={editable}
          created={created}
          errors={errors}
          handleUpdate={handleUpdate}
          handleCreate={handleCreate}
          handleDeleteRecipe={handleDeleteRecipe}
          cancelEdits={cancelEdits}
          beginEdits={beginEdits}
        />
      </Grid>
    </Grid>
  );
};

RecipePage.propTypes = {
  id: PropTypes.string,
  user: PropTypes.shape({
    id: PropTypes.string,
  }),
  snackbarRef: PropTypes.object,
};

export {
  RecipePage,
  MESSAGE_RECIPE_LOADED,
  MESSAGE_TOKEN_EXPIRED,
  ID_EDIT_BUTTON,
  ID_CANCEL_BUTTON,
  ID_SAVE_BUTTON,
  ID_DELETE_BUTTON,
};
