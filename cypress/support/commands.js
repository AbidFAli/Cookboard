import { KEY_USER_STORAGE } from '../../src/components/LoginWindow';

// **********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('isMyRecipesPageUrl', () => {
  cy.url().should('match', /myrecipes\/[\da-f]+/)
})
Cypress.Commands.add('createUser', (user) => {
  cy.request('POST', 'http://localhost:3001/api/users', user )
})

Cypress.Commands.add('login', (username, password) => {
  cy.request({
    method: 'POST',
    url : 'http://localhost:3001/api/login',
    body: {
      username,
      password
    }
  })
  .then(response => {
    let userToSave = JSON.stringify(response.body);
    window.localStorage.setItem(KEY_USER_STORAGE, userToSave )
  })
  cy.visit('http://localhost:3000/login')
})

/*
 *Parent command. Creates a recipe for a user.
 *@param user : {username, password}
 *@yields undefined
 */
Cypress.Commands.add('createRecipe', (recipe, user) => {
  let url = 'http://localhost:3001/api/recipes'
  cy.request('POST', 'http://localhost:3001/api/login', user)
    .then(response => {
      let loggedInUser = response.body;
      return cy.request({
        method: 'POST', 
        url : url,
        body: recipe,
        headers : {
          'Authorization' : `Bearer ${loggedInUser.token}`
        } 
      })
    })
})

Cypress.Commands.add('getByTestId', (dataTestId) => {
  return cy.get(`[data-testid=${dataTestId}]`)
})