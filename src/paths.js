//paths for routes

const PATH_RECIPES = "/recipes";
const PATH_RECIPES_PAGE = `${PATH_RECIPES}/:recipeId([a-f\\d]{24})`;
const PATH_RECIPES_EDIT_PHOTOS = `${PATH_RECIPES}/:recipeId([a-f\\d]{24})/photos/edit`;
const PATH_CREATE_RECIPE = "/recipes/create";
const PATH_SEARCH = `${PATH_RECIPES}/search`;
const PATH_MYRECIPES = "/myrecipes";
const PATH_LOGIN = "/login";
const PATH_REGISTRATION = "/login#signup";
const PATH_HOME = "/home";

export {
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
