//paths for routes

const PATH_RECIPES = "/recipes";
const PATH_RECIPES_PAGE = `${PATH_RECIPES}/:recipeId([a-f\\d]{24})`;
const PATH_RECIPES_EDIT_PHOTOS = `${PATH_RECIPES}/:recipeId([a-f\\d]{24})/photos/edit`;
const PATH_CREATE_RECIPE = "/recipes/create";
const PATH_MYRECIPES = "/myrecipes";
const PATH_LOGIN = "/login";
const PATH_REGISTRATION = "/login#signup";
const PATH_SEARCH = "/search";
const PATH_HOME = "/home";

const PATH_API_RECIPES = process.env.REACT_APP_API_BASE_URL + "/recipes";

export {
  PATH_API_RECIPES,
  PATH_MYRECIPES,
  PATH_LOGIN,
  PATH_REGISTRATION,
  PATH_RECIPES,
  PATH_CREATE_RECIPE,
  PATH_RECIPES_PAGE,
  PATH_RECIPES_EDIT_PHOTOS,
  PATH_SEARCH,
  PATH_HOME,
};
