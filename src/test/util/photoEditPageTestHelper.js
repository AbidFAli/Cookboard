import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import React from "react";
import { Router } from "react-router";
import {
  ID_BUTTON_CLOSE_NOTIFICATION,
  SnackbarProvider,
} from "../../components/NotificationSnackbar";
import {
  messages,
  PhotoEditPage,
} from "../../components/pages/photo-edit/PhotoEditPage";
import recipeService from "../../services/recipeService";

/*
 *@returns the history object used to set up the PhotoEditPage. 
    This is useful for assertions or programmatic navigation.
 */
const renderPage = async (user, photos, recipeId) => {
  const ref = React.createRef();
  let initialEntries = [
    `/myrecipes/${recipeId}/photos/edit`,
    `/myrecipes/${recipeId}`,
  ];
  const history = createMemoryHistory({ initialEntries });
  recipeService.getById.mockResolvedValueOnce({
    photos,
  });

  render(
    <Router history={history}>
      <PhotoEditPage user={user} snackbarRef={ref} recipeId={recipeId} />
      <SnackbarProvider ref={ref} />
    </Router>
  );
  await waitFor(() =>
    expect(screen.getByText(messages.PHOTOS_LOADED)).toBeInTheDocument()
  );

  userEvent.click(screen.getByTestId(ID_BUTTON_CLOSE_NOTIFICATION));

  return history;
};

const testHelper = {
  renderPage,
};
export default testHelper;
