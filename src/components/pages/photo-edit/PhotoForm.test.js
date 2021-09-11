import { cleanup, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import userFixture from "../../../test/fixtures/user/userNoRecipes";
import testHelper from "../../../test/util/photoEditPageTestHelper";
import { ids, PLACEHOLDER_URL } from "./PhotoForm";
jest.mock("../../../services/recipeService");

function uploadFile(file) {
  let input = screen.getByTestId(ids.ID_INPUT_PHOTO_FILE);
  userEvent.upload(input, file);
}

function clickAdd() {
  let addButton = screen.getByTestId(ids.ID_BUTTON_ADD_PHOTO);
  userEvent.click(addButton);
}

function clickBack() {
  userEvent.click(screen.getByTestId(ids.ID_BACK_BUTTON));
}

const testFiles = [
  new File(["foo"], "foo.png", {
    type: "image/png",
  }),
  new File(["bar"], "bar.png", {
    type: "image/png",
  }),
  new File(["hello"], "hello.png", {
    type: "image/png",
  }),
  new File(["goodbye"], "goodbye.png", {
    type: "image/png",
  }),
  new File(["extra"], "extra.png", {
    type: "image/png",
  }),
];

describe("PhotoForm integration tests within PhotoEditPage", () => {
  afterEach(cleanup);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  let recipe = null;

  describe("when adding photos", () => {
    beforeEach(async () => {
      let user = userFixture();
      recipe = {
        name: "waffles",
        ingredients: [{ name: "egg", amount: 1, id: "2001" }],
        id: "1234",
        user: user.id,
        photos: [],
      };

      await testHelper.renderPage(user, recipe.photos, recipe.id);
    });

    test("can upload an image", async () => {
      uploadFile(testFiles[0]);

      await waitFor(() => {
        expect(
          screen
            .getByTestId(ids.ID_RECIPE_IMAGE)
            .src.endsWith(testFiles[0].name)
        ).toBeTruthy();
      });
    });

    test("after adding the image, can edit the caption", async () => {
      uploadFile(testFiles[0]);
      const text = "Something";
      const input = screen.getByTestId(ids.ID_FIELD_PHOTO_CAPTION);
      userEvent.type(input, text);
      expect(input).toHaveDisplayValue(text);
    });

    test("can click the add button to add another photo", async () => {
      uploadFile(testFiles[0]);
      let addButton = screen.getByTestId(ids.ID_BUTTON_ADD_PHOTO);
      expect(addButton).toBeEnabled();
      userEvent.click(addButton);
      expect(screen.getByRole("img").src).not.toEqual(testFiles[0].name);
    });

    test("clicking the add photo button adds a new blank photo to the end of the list", async () => {
      uploadFile(testFiles[0]);
      clickAdd();
      uploadFile(testFiles[1]);
      clickBack();
      clickAdd();
      expect(screen.getByText("3 / 3")).toBeInTheDocument();
      expect(screen.getByRole("img").src).toEqual(PLACEHOLDER_URL);
    });

    test("cannot add a new photo if no file has been selected for the last photo in the list", async () => {
      uploadFile(testFiles[0]);
      clickAdd();
      expect(screen.getByTestId(ids.ID_BUTTON_ADD_PHOTO)).toBeDisabled();
    });

    test("save button is disabled if a photo is blank", async () => {
      uploadFile(testFiles[0]);
      clickAdd();
      expect(screen.getByTestId(ids.ID_BUTTON_SAVE_CHANGES)).toBeDisabled();
    });
  });

  describe("when editing photos", () => {
    beforeEach(async () => {
      let user = userFixture();
      recipe = {
        name: "waffles",
        id: "1234",
        user: user.id,
        photos: [
          {
            key: "/waffles.png",
            url: "awss3.com/waffles.png",
            caption: "waffles",
          },
          {
            key: "/syrup.png",
            url: "awss3.com/syrup.png",
            caption: "waffles and syrup",
          },
        ],
      };

      await testHelper.renderPage(user, recipe.photos, recipe.id);
    });

    test("can change the photo for an existing entry in the list", async () => {
      uploadFile(testFiles[0]);
      expect(
        screen.getByTestId(ids.ID_RECIPE_IMAGE).src.endsWith(testFiles[0].name)
      ).toBeTruthy();
    });

    test("can change the caption for an existing entry in the list", async () => {
      userEvent.click(screen.getByTestId(ids.ID_NEXT_BUTTON));
      const text = "Something";
      const input = screen.getByTestId(ids.ID_FIELD_PHOTO_CAPTION);
      userEvent.type(input, text);
      expect(input).toHaveDisplayValue(text);
    });
  });

  describe("when deleting photos", () => {
    beforeEach(async () => {
      let user = userFixture();
      recipe = {
        name: "waffles",
        ingredients: [{ name: "egg", amount: 1, id: "2001" }],
        id: "1234",
        user: user.id,
        photos: [
          { url: "waffles.com", caption: "waffles" },
          { url: "syrup.com", caption: "waffles and syrup" },
          { url: "three.com", caption: "three" },
        ],
      };

      await testHelper.renderPage(user, recipe.photos, recipe.id);
    });

    test("can delete the first photo", async () => {
      userEvent.click(screen.getByTestId(ids.ID_BUTTON_DELETE_PHOTO));
      expect(screen.getByTestId(ids.ID_RECIPE_IMAGE).src).not.toEqual(
        recipe.photos[0].url
      );
    });
    test("can delete the last photo", async () => {
      let nextButton = screen.getByTestId(ids.ID_NEXT_BUTTON);
      userEvent.click(nextButton);
      userEvent.click(nextButton);
      userEvent.click(screen.getByTestId(ids.ID_BUTTON_DELETE_PHOTO));
      expect(screen.getByTestId(ids.ID_RECIPE_IMAGE).src).not.toEqual(
        recipe.photos[recipe.photos.length - 1].url
      );
    });
  });
});
