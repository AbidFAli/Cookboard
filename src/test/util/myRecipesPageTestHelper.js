import { act, render } from "@testing-library/react";
import { ThemeProviderHelper } from "components/ThemeProviderHelper";
import React from "react";
import { MemoryRouter, Route, Switch } from "react-router-dom";
import { SnackbarProvider } from "../../components/NotificationSnackbar";
import { RecipeSwitch } from "../../components/RecipeSwitch";
import { MyRecipesPage } from "../../components/pages/MyRecipesPage";
import { PATH_MYRECIPES, PATH_RECIPES } from "../../paths";

const renderPage = async (user) => {
  const snackbarRef = React.createRef();

  await act(async () => {
    render(
      <ThemeProviderHelper>
        <MemoryRouter initialEntries={["/myrecipes"]} initialIndex={0}>
          <Switch>
            <Route path={PATH_RECIPES}>
              <RecipeSwitch user={user} snackbarRef={snackbarRef} />
            </Route>
            <Route path={PATH_MYRECIPES}>
              <MyRecipesPage user={user} snackbarRef={snackbarRef} />
            </Route>
          </Switch>
          <SnackbarProvider ref={snackbarRef} />
        </MemoryRouter>
      </ThemeProviderHelper>
    );
  });
};

const testHelper = {
  renderPage,
};

export default testHelper;
