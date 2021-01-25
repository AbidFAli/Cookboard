import { Nutrient, Ingredient, Measurable } from './ingredient.js';
const assert = require('assert');



describe("tests for Ingredient", () => {
    test('toString default case', () => {
        let testIngredient = new Ingredient("flour", 1.5, "cups");
        expect(testIngredient.toString()).toMatch("flour, 1.5 cups");
    });

    test('toString no unit', () => {
        let testIngredient = new Ingredient("egg", 1);
        expect(testIngredient.toString()).toMatch("egg, 1");
    });
});

describe("tests for Nutrient", () => {
    test('can create', () => {
        let nutr = new Nutrient("iron", 5, "mg");
        assert(nutr.name === "iron");
        assert(nutr.amount === 5);
        assert(nutr.unit === "mg");
    });

});