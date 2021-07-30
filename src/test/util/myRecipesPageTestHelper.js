import { act, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MyRecipesPage } from '../../components/MyRecipesPage';
import { SnackbarProvider } from '../../components/NotificationSnackbar';

const renderPage = async (user) => {
  const snackbarRef = React.createRef()

  await act(async () => {
      render (
          <MemoryRouter initialEntries = {["/myrecipes"]} initialIndex = {0}>
              <Route path = "/myrecipes">
                  <MyRecipesPage user = {user} snackbarRef = {snackbarRef} />
              </Route>
              <SnackbarProvider ref = {snackbarRef} />
          </MemoryRouter>
          )
  });
}



const testHelper = {
  renderPage
}

export default testHelper;