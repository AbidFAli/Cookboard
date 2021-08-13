import { React } from 'react';
import { Route, Switch } from "react-router-dom";
import { PATH_CREATE_RECIPE, PATH_RECIPES } from '../paths';
import { RecipePage } from './pages/recipe-page/RecipePage';

function RecipeSwitch({user, snackbarRef}){
  return (
    <Switch>
        <Route path = {PATH_CREATE_RECIPE}>
            <RecipePage 
                user = {user}
                snackbarRef = {snackbarRef}
                />
        </Route>
        <Route path={`${PATH_RECIPES}/:recipeId`}
            render={({ match }) => (
                <RecipePage 
                    id={match.params.recipeId}
                    user = {user}
                    snackbarRef = {snackbarRef}
                    />
            )}
        />
    </Switch>
  );
}

export {
  RecipeSwitch
};

