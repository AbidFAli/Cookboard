import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { recipePhotoService } from "../../../services/recipePhotoService";
import userFixture from "../../../test/fixtures/user/userNoRecipes";
import testHelper from "../../../test/util/photoEditPageTestHelper";
import { ids } from "./PhotoForm";
jest.mock("../../../services/recipeService");
jest.mock("../../../services/recipePhotoService");

const clearMocks = () => {
  recipePhotoService.saveImage.mockClear();
  recipePhotoService.savePhotos.mockClear();
};

recipePhotoService.saveImage.mockImplementation(() =>
  Promise.resolve(String(Math.random()))
); //return a key
recipePhotoService.savePhotos.mockResolvedValue("something"); //doesnt matter what this returns, just resolve

//existing photos have url and key
//newly added photos have a file
describe("when saving changes", () => {
  let photos;

  afterEach(() => {
    clearMocks();
  });

  beforeEach(async () => {
    let user = userFixture();
    let recipeId = "1234";
    photos = [
      { caption: "cap1", file: new File(["abc1802132"], "file1.png") },
      { url: "amazon.com/fakebucket/somekey", caption: "cap2", key: "somekey" },
      { caption: "cap3", file: new File(["ea8re9aghagghad"], "file3.png") },
    ];
    await testHelper.renderPage(user, photos, recipeId);
  });

  test("only photos with files are uploaded to S3", async () => {
    userEvent.click(screen.getByTestId(ids.ID_BUTTON_SAVE_CHANGES));
    await waitFor(() =>
      expect(recipePhotoService.saveImage).toHaveBeenCalledTimes(2)
    );
    expect(recipePhotoService.saveImage.mock.calls[0][0]).toBe(photos[0].file);
    expect(recipePhotoService.saveImage.mock.calls[1][0]).toBe(photos[2].file);
  });

  test("photo metadata is passed to savePhotos", async () => {
    userEvent.click(screen.getByTestId(ids.ID_BUTTON_SAVE_CHANGES));
    await waitFor(() => {
      expect(recipePhotoService.savePhotos).toHaveBeenCalledTimes(1);
    });
    for (let photo of photos) {
      expect(recipePhotoService.savePhotos.mock.calls[0][0]).toContainEqual(
        expect.objectContaining({
          key: expect.anything(),
          caption: photo.caption,
        })
      );
    }
  });

  test("a progress bar appears and reaches 100%", async () => {
    userEvent.click(screen.getByTestId(ids.ID_BUTTON_SAVE_CHANGES));
    expect(await screen.findByText("100%")).toBeInTheDocument();
  });
});
