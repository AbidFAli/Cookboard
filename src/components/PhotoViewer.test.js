import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PhotoViewer, ids } from "./PhotoViewer";
import { ThemeProviderHelper } from "./ThemeProviderHelper";

function renderPhotoViewer(photos) {
  render(
    <ThemeProviderHelper>
      <PhotoViewer photos={photos} photoWidth={400} photoHeight={400} />
    </ThemeProviderHelper>
  );
}

function clickNext() {
  userEvent.click(screen.getByTestId(ids.BUTTON_NEXT_PHOTO));
}

function clickBack() {
  userEvent.click(screen.getByTestId(ids.BUTTON_PREV_PHOTO));
}

describe("tests for PhotoViewer", () => {
  describe("viewing a single photo", () => {
    let photos;
    beforeEach(() => {
      photos = [{ caption: "Something" }];
      renderPhotoViewer(photos);
    });

    test("displays the caption of the photo", () => {
      expect(screen.getByText("Something")).toBeInTheDocument();
    });

    test("back is disabled on the first photo", () => {
      expect(screen.getByTestId(ids.BUTTON_PREV_PHOTO)).toBeDisabled();
    });
  });

  describe("viewing multiple photos", () => {
    let photos = beforeEach(() => {
      photos = [
        { caption: "Something" },
        { caption: "Stuff" },
        { caption: "A nice caption" },
      ];
      renderPhotoViewer(photos);
    });

    test("clicks through multiple photos", () => {
      for (let i = 1; i < photos.length; i++) {
        clickNext();
        expect(screen.getByText(photos[i].caption)).toBeInTheDocument();
      }
    });

    test("next is disabled on the last photo", () => {
      for (let i = 1; i < photos.length; i++) {
        clickNext();
      }
      expect(screen.getByTestId(ids.BUTTON_NEXT_PHOTO)).toBeDisabled();
    });
  });
});
