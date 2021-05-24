
const recipeService = jest.createMockFromModule('../recipeService.js')

recipeService.update = (recipe) => recipe;
module.exports = recipeService