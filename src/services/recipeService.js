import axios from "axios";
import { isTokenExpiredError } from "../util/errors";
import { authHeaderForUser, processSearchParams } from "./recipeServiceHelper";
import { userService } from "./userService";

const BASE_URL = "http://localhost:3001/api/recipes";
const DEFAULT_SEARCH_BATCH_SIZE = 20;

//will throw TokenExpiredErrors
const create = async (recipe, user) => {
  try {
    const result = await axios.post(BASE_URL + "/", recipe, {
      headers: authHeaderForUser(user),
    });
    return result.data;
  } catch (error) {
    console.log(error);
    if (isTokenExpiredError(error)) {
      throw error;
    }
  }
};

const getById = async (id) => {
  try {
    const result = await axios.get(BASE_URL + `/${id}`);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

const getAll = async () => {
  try {
    const result = await axios.get(BASE_URL + "/");
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

/*
*@param start: Number; the position(starts at 0) of the recipe in the search results from which to begin returning.
  Ignored if params.count is provided
*@param params : {
* name: String; the name of the recipe to search for,
* ingredient: String; the name of the ingredient to search for,
* ratingMin: Number; 
* ratingMax: Number;
* count: Number; whether to return recipes or a count of the number of recipes matching the search criteria;
*}
*/
const search = async (params, start, size = DEFAULT_SEARCH_BATCH_SIZE) => {
  let paramsToSend = processSearchParams(params);
  if (!paramsToSend.count) {
    paramsToSend.size = size;
    paramsToSend.start = start;
  }
  let results = await axios.get(BASE_URL + "/search", {
    params: paramsToSend,
  });
  return results.data;
};

const getNumberSearchResults = async (params) => {
  let paramsToSend = { ...params };
  paramsToSend.count = "true";
  let results = await search(paramsToSend);
  return results.count;
};

//will throw TokenExpiredErrors
const update = async (recipe, user) => {
  try {
    const result = await axios.put(BASE_URL + `/${recipe.id}`, recipe, {
      headers: authHeaderForUser(user),
    });
    return result.data;
  } catch (error) {
    console.log(error);
    if (isTokenExpiredError(error)) {
      throw error;
    }
  }
};

//will throw TokenExpiredErrors
const destroy = async (recipeId, user) => {
  try {
    await axios.delete(BASE_URL + `/${recipeId}`, {
      headers: authHeaderForUser(user),
    });
  } catch (error) {
    console.log(error);
    if (isTokenExpiredError(error)) {
      throw error;
    }
  }
};

/*
 *@returns [{name, id}]
 */
const getRecipesForUser = async (userId) => {
  try {
    const user = await userService.getById(userId);
    return user.recipes;
  } catch (error) {
    console.log(error);
  }
};

const recipeService = {
  create,
  getById,
  getAll,
  update,
  destroy,
  getRecipesForUser,
  search,
  getNumberSearchResults,
  DEFAULT_SEARCH_BATCH_SIZE,
};

export default recipeService;
