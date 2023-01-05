import axios from "axios";
import { isTokenExpiredError } from "../util/errors";
import { userService } from "./userService";

const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/recipes`;
const DEFAULT_SEARCH_BATCH_SIZE = 20;

//TODO: catch TokenExpiredErrors somewhere. Are my error cases okay? Should I try catch all async in the caller or the function 


interface IUser{
  id?: string
  username?: string;
  email?: string;
  recipes?: Array<unknown>;
  token: string;
}

interface CreateRecipeInput{
  name: string;
  description?: string;
  timeToMake?: { unit: string, value: number};
  servingInfo?: {numServed: number, yield: number, servingSize: number, unit: string};
  instructions?: string[];
  ingredients?: IngredientType;
}

//TODO these types
type PhotoType = Array<unknown>;
type IngredientType = Array<unknown>;

interface RawRecipe extends CreateRecipeInput{
  numRatings: number;
  avgRating: number;
  photos?: PhotoType;
  calories: number; //functionality not implemented
  user: string;
}


interface UpdateRecipeInput{
  id: string
  description?: string;
  timeToMake?: { unit: string, value: number};
  servingInfo?: {numServed: number, yield: number, servingSize: number, unit: string};
  instructions?: string[];
  ingredients?: IngredientType; 
  numRatings: number; //TODO should you be able to update this?
  photos?: PhotoType; //TODO should you be able to update this?
  avgRating: number; //TODO should you be able to update this?
  calories?: number;
  user: string; //TODO should you be able to update this?
}

//@throws TokenExpiredErrors
const create = async (recipe: CreateRecipeInput, user: IUser) : Promise<RawRecipe> => {
    const result = await axios.post(BASE_URL + "/", recipe, {
      headers: authHeaderForUser(user),
    });
    return result.data as RawRecipe;
};

const getById = async (id: string): Promise<RawRecipe> => {
    const result = await axios.get(BASE_URL + `/${id}`);
    return result.data as RawRecipe;
};

const getAll = async (): Promise<Array<RawRecipe>> => {
    const result = await axios.get(BASE_URL + "/");
    return result.data as Array<RawRecipe>;
};





interface InputRecipeSearchParams{
  name?: string;
  ingredient?: string;
  ratingMin?: number;
  ratingMax?: number;
  count?: "true" | "True" | "false" | "False"| boolean | 1 | 0; //TODO: wtf is up with this. Which params actually work?
}

type RecipeSearchResult = RawRecipe[] | {count: number};



/*
*@param start: Number; the position(starts at 0) of the recipe in the search results from which to begin returning.
  Ignored if params.count is provided
*@param params : {
* name: string; the name of the recipe to search for,
* ingredient: string; the name of the ingredient to search for,
* ratingMin: Number; 
* ratingMax: Number;
* count: Number; whether to return recipes or a count of the number of recipes matching the search criteria;
*}
*/
const search = async (params: InputRecipeSearchParams, start = 0, size = DEFAULT_SEARCH_BATCH_SIZE): Promise<RecipeSearchResult>  => {
  interface InternalSearchParams extends InputRecipeSearchParams{
    size?: number, 
    start?: number
  }

  const paramsToSend = processSearchParams(params) as InternalSearchParams;
  if (!paramsToSend.count) {
    paramsToSend.size = size;
    paramsToSend.start = start;
  }
  const results = await axios.get(BASE_URL + "/search", {
    params: paramsToSend,
  });
  return results.data;
};

/*
*@throws RecipeSearchError
*/
const getNumberSearchResults = async (params: InputRecipeSearchParams): Promise<number> => {
  const paramsToSend = { ...params };
  paramsToSend.count = "true"; //wtf??
  const results = await search(paramsToSend);
  if(results !== undefined && "count" in results){
    return results.count;
  }
  else{
    throw new RecipeSearchError(`getNumberSearchResults: search returned ${results.toString()} instead of {count: number}`);
  }
};

/*
*@throws TokenExpiredErrors
*/

const update = async (recipe: UpdateRecipeInput, user: IUser): Promise<RawRecipe> => {
    const result = await axios.put(BASE_URL + `/${recipe.id}`, recipe, {
      headers: authHeaderForUser(user),
    });
    return result.data;
};

/*
*@throws TokenExpiredErrors
*/
const destroy = async (recipeId: string, user: IUser): Promise<void> => {
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
const getRecipesForUser = async (userId: string): Promise<Array<RawRecipe>> => {
    const user = await userService.getById(userId);
    return user.recipes;
};


class RecipeSearchError extends Error{
  constructor(message: string){
    super(message)
    this.name="RecipeSearchError";
  }
}

//checks for errors in the search parameters
const processSearchParams = (params: InputRecipeSearchParams) => {
  const paramsToSend = { ...params };

  if (typeof params.name === "string") {
    paramsToSend.name = params.name.trim();
  } else {
    throw new RecipeSearchError("params.name must be string");
  }

  if (typeof params.ingredient === "string") {
    paramsToSend.ingredient = params.ingredient.trim();
  } else {
    throw new RecipeSearchError("params.ingredient must be string");
  }

  if (typeof params.ratingMin !== "number" || Number.isNaN(params.ratingMin)) {
    throw new RecipeSearchError("params.ratingMin must be a number");
  }

  if (typeof params.ratingMax !== "number" || Number.isNaN(params.ratingMin)) {
    throw new RecipeSearchError("params.ratingMax must be a number");
  }

  return paramsToSend;
};

interface AuthHeader{
  Authorization: string;
}

const authHeaderForUser = (user: IUser): AuthHeader => {
  return { Authorization: `Bearer ${user.token}` };
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
  DEFAULT_SEARCH_BATCH_SIZE
}

export {
  authHeaderForUser
};
export default recipeService;