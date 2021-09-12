import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { PATH_CREATE_RECIPE } from "../../paths";
import recipeService from "../../services/recipeService";
import { RecipeList } from "../RecipeList";

const TITLE_MY_RECIPES = "My Recipes";
const ID_BUTTON_ADD_RECIPE = "MyRecipesPage_addRecipeButton";
const MESSAGE_NO_RECIPES =
  "You have no recipes. Click on the button below to create one.";

/*
 *@prop user
 *@prop snackbarRef
 */
function MyRecipesPage({ user, snackbarRef }) {
  const history = useHistory();
  let [recipes, setRecipes] = useState([]);

  const fetchRecipeNames = async (userId) => {
    let recipes = await recipeService.getRecipesForUser(userId);
    setRecipes(recipes);
  };

  useEffect(() => {
    if (user == null) {
      recipeService.getAll().then((fetchedRecipes) => {
        setRecipes(fetchedRecipes);
      });
    } else {
      //can't just call setRecipes on user.recipes b/c those recipes may be stale( if user was restored from localstorage)
      fetchRecipeNames(user.id); //get updated recipe names/ids for the user
    }
  }, [user]);

  const goToNew = () => {
    history.push(PATH_CREATE_RECIPE);
    console.log(PATH_CREATE_RECIPE);
  };

  return (
    <Grid container spacing={4}>
      <Grid
        container
        item
        xs={12}
        spacing={3}
        justifyContent="center"
        alignItems="flex-end"
      >
        <Grid item>
          <Typography variant="h2">{TITLE_MY_RECIPES}</Typography>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <RecipeList recipes={recipes} messageNoContent={MESSAGE_NO_RECIPES} />
        </Paper>
      </Grid>
      <Grid item>
        <Fab
          color="primary"
          aria-label="add"
          onClick={goToNew}
          data-testid={ID_BUTTON_ADD_RECIPE}
        >
          <AddIcon />
        </Fab>
      </Grid>
    </Grid>
  );
}

MyRecipesPage.propTypes = {
  user: PropTypes.object,
  snackbarRef: PropTypes.object,
};

export {
  MyRecipesPage,
  ID_BUTTON_ADD_RECIPE,
  MESSAGE_NO_RECIPES,
  TITLE_MY_RECIPES,
};
