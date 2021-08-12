import { act, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import { MyRecipesPage } from '../../components/MyRecipesPage';
import { SnackbarProvider } from '../../components/NotificationSnackbar';
import { RecipeSwitch } from '../../components/RecipeSwitch';
import { PATH_MYRECIPES, PATH_RECIPES } from '../../paths';

const renderPage = async (user) => {
  const snackbarRef = React.createRef()

  await act(async () => {
      render (
          <MemoryRouter initialEntries = {["/myrecipes"]} initialIndex = {0}>
            <Switch>
              <Route path = {PATH_RECIPES} >
                <RecipeSwitch user = {user} snackbarRef = {snackbarRef}/>
              </Route>
              <Route path = {PATH_MYRECIPES}>
                  <MyRecipesPage user = {user} snackbarRef = {snackbarRef} />
              </Route>
            </Switch>
            <SnackbarProvider ref = {snackbarRef} />
          </MemoryRouter>
          )
  });
}



const testHelper = {
  renderPage
}

export default testHelper;