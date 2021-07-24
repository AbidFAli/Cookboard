import {
  ID_BUTTON_LOG_IN,
  ID_INPUT_PASSWORD,
  ID_INPUT_USERNAME,
  MESSAGE_INVALID_PASSWORD
} from '../../src/components/LoginWindow';



describe('E2E tests for login', () => {
  beforeEach( function () {
    cy.request('POST','http://localhost:3001/api/test/reset')
    cy.fixture('users/simple.json').as('testUser').then((testUser) => {
      cy.request('POST', 'http://localhost:3001/api/users', testUser).as('userCreationRequest')
    })
    
    
  })

  describe('without a logged in user', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/login')
    });
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
  
  describe('when the user is logged in', () => {
    beforeEach(() => {
      cy.get('@testUser').then(testUser => {
        cy.login(testUser.username, testUser.password)
      })
    });


    it('Clicking on the logout button returns you to the login window', () => {
      cy.contains('Logout').click()
      cy.url().should('match', /login/)
      cy.get(`[data-testid=${ID_BUTTON_LOG_IN}`)
    })
  })
  

})

