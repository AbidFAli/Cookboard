import { ID_BUTTON_CLOSE_NOTIFICATION } from "../../src/components/NotificationSnackbar";
import { ID_BUTTON_ADD_RECIPE } from "../../src/components/pages/MyRecipesPage";
import { ids } from "../../src/components/pages/photo-edit/PhotoEditPage";
import { ID_FIELD_DESCRIPTION } from "../../src/components/pages/recipe-page/RecipeDescription";
import { ID_FIELD_RECIPE_NAME } from "../../src/components/pages/recipe-page/RecipeName";
import {
  ID_CANCEL_BUTTON,
  ID_EDIT_BUTTON,
  ID_SAVE_BUTTON,
} from "../../src/components/pages/recipe-page/RecipePage";
import { PATH_CREATE_RECIPE, PATH_MYRECIPES } from "../../src/paths";
import recipeService from "../../src/services/recipeService";

describe("RecipePage", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3001/api/test/reset");
    cy.fixture("users/simple.json")
      .as("userInfo")
      .then((user) => {
        cy.createUser(user);
      });
    cy.get("@userInfo").then((user) => {
      cy.fixture("recipes/waffles.json").then((recipe) => {
        cy.createRecipe(recipe, user).as("wafflesCreationResponse");
      });
      cy.login(user.username, user.password);
    });
  });

  describe("when editing an existing recipe", () => {
    beforeEach(() => {
      cy.contains("waffles").click();
      cy.getByTestId(ID_BUTTON_CLOSE_NOTIFICATION).click(); //close snackbar
      cy.get(`[data-testid=${ID_EDIT_BUTTON}]`).click();
    });

    it("restores the original recipe after canceling edits", function () {
      cy.get(`[data-testid=${ID_FIELD_DESCRIPTION}]`).clear().type("something");
      cy.get(`[data-testid=${ID_CANCEL_BUTTON}]`).click(); //click again to cancel
      cy.get("@wafflesCreationResponse").then((response) => {
        let testRecipe = response.body;
        cy.get(`[data-testid=${ID_FIELD_DESCRIPTION}]`).should(
          "have.text",
          testRecipe.description
        );
      });
    });

    it("restores edits after navigating back to RecipePage from PhotoEditPage", () => {
      cy.getByTestId(ID_FIELD_DESCRIPTION).clear().type("something"); //make edits
      cy.contains("Click me to add photos").click(); //navigate
      cy.getByTestId(ids.ID_BACK_BUTTON).click();
      cy.getByTestId(ID_FIELD_DESCRIPTION).should("have.text", "something");
      cy.getByTestId(ID_FIELD_DESCRIPTION).clear().type("else"); //make sure the page is in edit mode, not view mode
      cy.getByTestId(ID_FIELD_DESCRIPTION).should("have.text", "else");
    });

    it("does not contain edits after RecipePage -> PhotoEdit ->... -> RecipePage ", () => {
      cy.getByTestId(ID_FIELD_DESCRIPTION).clear().type("something"); //make edits
      cy.contains("Click me to add photos").click(); //navigate
      cy.contains("My Recipes").click();
      cy.contains("waffles").click();
      cy.getByTestId(ID_FIELD_DESCRIPTION).should("not.have.text", "something");
    });
  });

  describe("when creating a new recipe", function () {
    beforeEach(function () {
      cy.get(`[data-testid=${ID_BUTTON_ADD_RECIPE}]`).click();
    });

    it("allows recipes to be created", function () {
      const newRecipeName = "lemonade";
      cy.get(`[data-testid=${ID_FIELD_RECIPE_NAME}]`).type(newRecipeName);
      //enter other required fields

      //click create button
      cy.get(`[data-testid=${ID_SAVE_BUTTON}]`).click();
      //expect that recipe name appears
      cy.contains(newRecipeName);

      cy.isRecipesUrl();
      //expect that the recipe exists in the database
      //TODO: make this more reusable with command?
      cy.url()
        .then((url) => {
          let matches = url.match(/recipes\/([\da-f]+)/);
          if (matches.length >= 1 && matches[1]) {
            return matches[1];
          } else {
            throw new Error("invalid page url");
          }
        })
        .then((id) => {
          return recipeService.getById(id);
        })
        .then((recipe) => {
          expect(recipe.name).to.equal(newRecipeName);
        });
    });

    it("does not allow a recipe to be created if the name is blank", function () {
      let numInitialRecipes = 0;
      recipeService.getAll().then((recipes) => {
        numInitialRecipes = recipes.length;
      });

      cy.get(`[data-testid=${ID_SAVE_BUTTON}]`).click();
      cy.url().should("match", new RegExp(PATH_CREATE_RECIPE));

      recipeService.getAll().then((recipes) => {
        expect(recipes.length).to.equal(numInitialRecipes);
      });
    });

    it("returns you to the MyRecipes page if cancel is pressed", function () {
      cy.get(`[data-testid=${ID_CANCEL_BUTTON}]`).click();
      cy.url().should("match", new RegExp(PATH_MYRECIPES));
    });
  });
});
