import { act, render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MyRecipesPage } from '../../components/MyRecipesPage';

const renderPage = async (user) => {
  await act(async () => {
      render (
          <MemoryRouter initialEntries = {["/myrecipes"]} initialIndex = {0}>
              <Route path = "/myrecipes">
                  <MyRecipesPage user = {user} />
              </Route>
          </MemoryRouter>
          )
  });
}



const testHelper = {
  renderPage
}

export default testHelper;