import PropTypes from "prop-types";
import { React } from "react";
import { Route, Switch } from "react-router-dom";
import {
  PATH_CREATE_RECIPE,
  PATH_RECIPES_EDIT_PHOTOS,
  PATH_RECIPES_PAGE,
} from "../paths";
import { PhotoEditPage } from "./pages/photo-edit/PhotoEditPage";
import { RecipePage } from "./pages/recipe-page/RecipePage";

function RecipeSwitch({ user, snackbarRef }) {
  return (
    <Switch>
      <Route path={PATH_CREATE_RECIPE}>
        <RecipePage user={user} snackbarRef={snackbarRef} />
      </Route>
      <Route
        path={PATH_RECIPES_EDIT_PHOTOS}
        render={({ match }) => (
          <PhotoEditPage
            user={user}
            snackbarRef={snackbarRef}
            recipeId={match.params.recipeId}
          />
        )}
      />
      <Route
        path={PATH_RECIPES_PAGE}
        render={({ match }) => (
          <RecipePage
            id={match.params.recipeId}
            user={user}
            snackbarRef={snackbarRef}
          />
        )}
      />
    </Switch>
  );
}

RecipeSwitch.propTypes = {
  user: PropTypes.object,
  snackbarRef: PropTypes.object,
};
export { RecipeSwitch };
