import { Recipe } from "../../../Model/recipe";
const recipeFixture = () => {
  return new Recipe(
    "spaghetti",
    "ae17234bc127fe5109cafe42",
    "Some description"
  );
};

export default recipeFixture;
