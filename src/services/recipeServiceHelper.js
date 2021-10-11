//checks for errors in the search parameters
const processSearchParams = (params) => {
  let paramsToSend = { ...params };

  if (typeof params.name === "string") {
    paramsToSend.name = params.name.trim();
  } else {
    throw Error("params.name must be string");
  }

  if (typeof params.ingredient === "string") {
    paramsToSend.ingredient = params.ingredient.trim();
  } else {
    throw Error("params.ingredient must be string");
  }

  if (typeof params.ratingMin !== "number" || Number.isNaN(params.ratingMin)) {
    throw Error("params.ratingMin must be a number");
  }

  if (typeof params.ratingMax !== "number" || Number.isNaN(params.ratingMin)) {
    throw Error("params.ratingMax must be a number");
  }

  return paramsToSend;
};

const authHeaderForUser = (user) => {
  return { Authorization: `Bearer ${user.token}` };
};

export { processSearchParams, authHeaderForUser };
