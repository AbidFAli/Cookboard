import axios from "axios";
import { authHeaderForUser } from "./recipeServiceHelper";

const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/recipes/ratings`;

class RatingServiceError extends Error {
  constructor(message) {
    super(message);
  }
}

/*
 *@param {string} recipeId
 *@param {number} rating
 *@param {object} user
 *@returns {{
    rating: created rating object,
    average: number, 
    numRatings: number of ratings for a recipe
  }}
 */
const addRating = async (recipeId, user, rating ) => {
  try {
    const response = await axios.post(
      BASE_URL,
      { recipe: recipeId, value: rating },
      { headers: authHeaderForUser(user) }
    );
    return {
      rating: response.data.rating,
      average: response.data.avgRating,
      numRatings: response.data.numRatings,
    };
  } catch (error) {
    console.log(error);
  }
};

/*
 *@returns Array of Rating object
 *@throws RatingServiceError
 */
const getRatings = async (recipeId, user) => {
  let queryParams = new URLSearchParams();

  if (recipeId) {
    queryParams.append("recipe", recipeId);
  }
  if (user) {
    queryParams.append("userId", user.id);
  }
  const response = await axios.get(BASE_URL + "?" + queryParams.toString());

  if (
    Array.isArray(response.data) &&
    recipeId &&
    user &&
    response.data.length > 1
  ) {
    throw RatingServiceError("server returned more ratings than expected");
  }
  if (!Array.isArray(response.data)) {
    return [];
  }
  return response.data;
};

/*
 *@returns {avgRating: number, numRatings: number}
 */
const updateRating = async (recipeId, user, rating) => {
  let response = await axios.put(
    BASE_URL,
    { recipe: recipeId, value: rating },
    { headers: authHeaderForUser(user) }
  );
  return response.data;
};

const recipeRatingService = {
  addRating,
  updateRating,
  getRatings,
};

export { recipeRatingService };
