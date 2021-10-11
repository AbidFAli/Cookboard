import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { ids, PhotoViewer } from "./PhotoViewer";

function renderPhotoViewer(photos) {
  render(<PhotoViewer photos={photos} photoWidth={400} photoHeight={400} />);
}

function clickNext() {
  userEvent.click(screen.getByTestId(ids.BUTTON_NEXT_PHOTO));
}

function clickBack() {
  userEvent.click(screen.getByTestId(ids.BUTTON_PREV_PHOTO));
}

describe("tests for PhotoViewer", () => {
  test("renders placeholderElement and placeholderCaption if given no photos", () => {
    const placeholderElement = <p data-testid={"Ralph"}></p>;
    render(
      <PhotoViewer
        photoWidth={400}
        photoHeight={400}
        placeholderElement={placeholderElement}
        placeholderCaption="Im in danger"
      />
    );
    expect(screen.getByTestId("Ralph")).toBeInTheDocument();
    expect(screen.getByText("Im in danger")).toBeInTheDocument();
  });

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
