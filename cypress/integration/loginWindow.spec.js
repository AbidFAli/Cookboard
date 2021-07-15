import { ID_BUTTON_LOG_IN, ID_INPUT_PASSWORD, ID_INPUT_USERNAME, MESSAGE_INVALID_PASSWORD } from '../../src/components/LoginWindow';


describe('LoginWindow integration tests', () => {
  let userPromise;
  beforeEach( function () {
    cy.request('POST','http://localhost:3001/api/test/reset')
    cy.fixture('users/simple.json').as('testUser').then((testUser) => {
      cy.request('POST', 'http://localhost:3001/api/users', testUser).as('userCreationRequest')
    })
    
    cy.visit('http://localhost:3000/login')
  })

  it('Clicking on the log in button after entering valid log in info takes you to the MyRecipes page', () => {
    cy.get('@testUser').then((testUser) => {
      cy.get(`[data-testid=${ID_INPUT_USERNAME}`).type(testUser.username)
      cy.get(`[data-testid=${ID_INPUT_PASSWORD}`).type(testUser.password)
    })
  
    cy.get(`[data-testid=${ID_BUTTON_LOG_IN}`).click()
    cy.contains('My Recipes')
    cy.url().should('match', /myrecipes/)
  
  })
  
  it('Logging in with an invalid password displays an error message', () => {
    cy.get('@testUser').then((testUser) => {
      cy.get(`[data-testid=${ID_INPUT_USERNAME}`).type(testUser.username)
      cy.get(`[data-testid=${ID_INPUT_PASSWORD}`).type('wrongpassword')
    });
  
    cy.get(`[data-testid=${ID_BUTTON_LOG_IN}`).click()
    cy.contains(MESSAGE_INVALID_PASSWORD)
  })

})

