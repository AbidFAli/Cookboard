import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Radio from "@material-ui/core/Radio";
import Typography from "@material-ui/core/Typography";
import RestaurantRoundedIcon from "@material-ui/icons/RestaurantRounded";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { PATH_RECIPES } from "../paths";

/*
 *
 * @prop recipes : a list of recipes; array of Recipe
 * @prop messageNoContent: the message to display when the recipe list is empty
 */
function RecipeList(props) {
  let content = null;
  const history = useHistory();
  const [selectedRecipe, setSelectedRecipe] = useState(null); //id of the selected recipe

  function handleCheck(event, recipe) {
    setSelectedRecipe(recipe);
    console.log(`${recipe.name}'s check handler was called`);
  }

  if (props.recipes == null || props.recipes.length === 0) {
    return (
      <Typography variant="subtitle1" gutterBottom>
        {props.messageNoContent}
      </Typography>
    );
  } else if (props.recipes != null) {
    content = props.recipes.map((recipe, index) => {
      return (
        <ListItem
          key={index}
          button
          onClick={() => history.push(`${PATH_RECIPES}/${recipe.id}`)}
        >
          <ListItemIcon>
            <RestaurantRoundedIcon />
          </ListItemIcon>
          <ListItemText primary={recipe.name} />
          <ListItemSecondaryAction>
            <Radio
              edge="end"
              onChange={
                (event) =>
                  handleCheck(
                    event,
                    recipe
                  ) /* only fires when radio is clicked */
              }
              checked={
                selectedRecipe !== null && selectedRecipe.id === recipe.id
              }
            />
          </ListItemSecondaryAction>
        </ListItem>
      );
    });
    return (
      <List data-testid="RecipeList" component="ul">
        {content}
      </List>
    );
  }
}

RecipeList.propTypes = {
  recipes: PropTypes.arrayOf(PropTypes.object),
};

export { RecipeList };
