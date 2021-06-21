import recipeService from '../../src/services/recipeService'
import {ID_EDIT_BUTTON} from '../../src/components/recipe-page/RecipePage'
import {ID_FIELD_DESCRIPTION } from '../../src/components/recipe-page/DescriptionRating'

describe('Recipe Page integration tests', function () {
  let recipePromise;
  beforeEach( function () {
    cy.request('POST','http://localhost:3001/api/test/reset')
    let recipeToSave = {
      name : "waffles",
      description : "yummy"
    }
    recipePromise = recipeService.create(recipeToSave)
    cy.visit('http://localhost:3000')
  })

  it('restores the original recipe after canceling edits', function () {
    cy.contains("waffles").debug().click()
    cy.get(`[data-testid=${ID_EDIT_BUTTON}]`).click()
    cy.get(`[data-testid=${ID_FIELD_DESCRIPTION}]`).clear().type("something")
    cy.get(`[data-testid=${ID_EDIT_BUTTON}]`).click() //click again to cancel
    cy.get(`[data-testid=${ID_FIELD_DESCRIPTION}]`).should('have.text', 'yummy')

    recipePromise.then((originalRecipe) => {
      return recipeService
        .getById(originalRecipe.id)
        .then((recipeAfterEdits) => {
          expect(recipeAfterEdits.description).to.equal(originalRecipe.description)
        })
    })
  


  })
})