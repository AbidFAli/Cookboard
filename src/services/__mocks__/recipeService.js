import {cloneDeep, uniqueId } from 'lodash'
const recipeService = jest.createMockFromModule('../recipeService.js')

//This should probably work for simple cases, but using uniqueId does not ensure that the id is unique
//Probably better to just use the actual recipeService instead
recipeService.update = (recipe) => {
  let newRecipe = cloneDeep(recipe)
  recipe.ingredients.forEach((ingredient) => {
    if(ingredient.id == undefined){
      ingredient.id = uniqueId()
    }
  })
  return newRecipe;
}
module.exports = recipeService