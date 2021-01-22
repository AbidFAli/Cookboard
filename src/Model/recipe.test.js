import { Recipe } from './recipe.js';
const assert = require('assert');


describe("Recipe tests", () => {
    var testRecipe;

    beforeEach(() => {
        let name = "Pancakes";
        let desc = "yummy";
        let instr = ["heat stove", "cover pan in oil", "add batter", "cook"];
        testRecipe = new Recipe(name, desc, instr);
    });



    test("add Ingredient to Recipe", () => {
        let testIngredient = { name: "pancake batter", calories: 300 };
        testRecipe.addIngredient(testIngredient);
        let foundIngredient = testRecipe.getIngredient(testIngredient.name);
        expect(foundIngredient).toEqual(testIngredient);
    });

    test("get Ingredient from Recipe", () => {
        let ing1 = { name: "pancake batter", calories: 300 };
        let ing2 = { name: "egg", calories: 100 };
        testRecipe.addIngredient(ing1);
        testRecipe.addIngredient(ing2);
        let ing3 = testRecipe.getIngredient("egg");
        expect(ing3).toEqual(ing2);
    });

    test("returns null when searching for ingredient not in recipe", () => {
        let ing1 = testRecipe.getIngredient("sugar");
        expect(ing1).toBeNull;
    });
});