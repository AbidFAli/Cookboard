import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { cloneDeep, isNil } from "lodash";
import PropTypes from "prop-types";
import React, { useEffect, useReducer, useState } from "react";
import { useHistory } from "react-router";
import { ErrorMessenger, reduceErrors } from "../../../Model/errorMessenger";
import { Ingredient } from "../../../Model/ingredient";
import Instruction from "../../../Model/instruction";
import { PATH_LOGIN, PATH_MYRECIPES, PATH_RECIPES } from "../../../paths";
import { recipePhotoService } from "../../../services/recipePhotoService";
import { recipeRatingService } from "../../../services/recipeRatingService";
import recipeService from "../../../services/recipeService";
import { isTokenExpiredError } from "../../../util/errors";
import { IngredientList } from "./IngredientList";
import { InstructionList } from "./InstructionList";
import { RecipeDescription } from "./RecipeDescription";
import { RecipeName } from "./RecipeName";
import { RecipePageButtons, ids as buttonIds } from "./RecipePageButtons";
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
const MESSAGE_RATING_UPDATED = "Rating updated succesfully";

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

const logger = (realUpdate, msg, toString) => {
  if (toString === undefined) {
    toString = (x) => String(x);
  }

  return (number) => {
    console.log(msg + "" + toString(number));
    realUpdate(number);
  };
};

const ratingToString = (rating) => {
  let str = `value:${rating.value},hasRated: ${rating.hasRated}, loaded: ${rating.loaded},`;
  str += `id:${rating.id}`;
  return str;
};

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

  const [avgRating, realSetAvgRating] = useState(0);
  const [userRating, realSetUserRating] = useState({
    value: 0,
    hasRated: false,
    loaded: false,
    id: "",
  });

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

  const setAvgRating = logger(realSetAvgRating, "Avg rating is: ");
  const setUserRating = logger(
    realSetUserRating,
    "My rating is: ",
    ratingToString
  );

  useEffect(() => {
    if (!props.id) {
      return;
    }
    recipeService.getById(props.id).then((recipe) => {
      props.snackbarRef.current.displayMessage(MESSAGE_RECIPE_LOADED);
      let oldRecipeJSON = window.sessionStorage.getItem(
        KEY_RECIPE_EDITED_FIELDS
      );
      window.sessionStorage.removeItem(KEY_RECIPE_EDITED_FIELDS);
      if (oldRecipeJSON && history.action === "POP") {
        console.log("Recipe loaded from local storage");
        let oldRecipe = JSON.parse(oldRecipeJSON);
        oldRecipe.photos = recipe.photos;
        setPageState(oldRecipe);
        setEditable(true);
      } else {
        setPageState(recipe);
      }
    });
    if (props.user) {
      recipeRatingService
        .getRatings(props.id, props.user)
        .then((ratingList) => {
          if (ratingList.length == 1) {
            let newRating = {
              value: ratingList[0].value,
              hasRated: true,
              loaded: true,
              id: ratingList[0].id,
            };
            setUserRating(newRating);
          } else {
            setUserRating({
              value: userRating.value,
              hasRated: userRating.hasRated,
              loaded: true,
              id: userRating.id,
            });
          }
        });
    }
  }, [props.id, props.user]);

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
      avgRating: avgRating,
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

  const handleUpdateRecipe = async () => {
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

  const handleCreateRecipe = async () => {
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
    setAvgRating(recipe != null && !isNil(recipe.rating) ? recipe.rating : 0);

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
      avgRating: avgRating,
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

  //TODO: test error cases
  const recipeRatingOnSave = async (ratingValue) => {
    //set rating early before the service call has completed
    setUserRating((prevUserRating) => ({
      value: ratingValue,
      hasRated: true,
      loaded: prevUserRating.loaded,
      id: prevUserRating.id,
    }));

    if (!userRating.hasRated) {
      let ratingInfo = await recipeRatingService.addRating(
        props.id,
        props.user,
        ratingValue
      ); //str || ""
      if (ratingInfo !== null) {
        setUserRating({
          value: ratingValue,
          hasRated: true,
          loaded: true,
          id: ratingInfo.rating.id,
        });

        setAvgRating(ratingInfo.average);
      } else {
        console.log("Add rating failed");
      }
    } else {
      let ratingInfo = await recipeRatingService.updateRating(
        props.id,
        props.user,
        ratingValue
      );
      if (ratingInfo !== null) {
        //set the average rating, display a message
        setAvgRating(ratingInfo.avgRating);
        props.snackbarRef.current.displayMessage(MESSAGE_RATING_UPDATED);
      }
      console.error("Update rating has not been implemeted");
    }

    //if user has not rated before, then create rating
    //else update rating
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
              initialRating={userRating.value}
              editable={
                userRating.loaded &&
                props.user &&
                props.user.id &&
                ownerId !== props.user.id
              }
              avgRating={avgRating}
              onSave={recipeRatingOnSave}
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
          handleUpdate={handleUpdateRecipe}
          handleCreate={handleCreateRecipe}
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
