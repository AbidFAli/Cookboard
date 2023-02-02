import { useState } from "react";
import userFixture from "../../../test/fixtures/user/userNoRecipes";
import { RecipeRating } from "./RecipeRating";

jest.mock("../../../services/recipeService");
jest.mock("../../../services/recipeRatingService");

const TestWrapper = (props) => {
  const [avgRating, setAvgRating] = useState(0);
  const [rating, setRating] = useState(0);
  return (
    <div>
      <RecipeRating
        initialRating={rating}
        avgRating={avgRating}
        editable={true}
        onSave={() => {}}
      />
    </div>
  );
};

describe("Tests for RecipeRating within RecipePage", () => {
  let recipe, user;
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    user = userFixture();
    //recipe =
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test("create the first rating for a recipe", async () => {});

  test("add a rating when another user has already rated", async () => {});

  // test("update a rating", () => {

  // })

  // test("delete a rating", () => {

  // })
});
