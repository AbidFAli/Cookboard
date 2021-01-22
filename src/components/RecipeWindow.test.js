import React from 'react';
import { Recipe } from '../Model/recipe.js';
import { Ingredient } from '../Model/ingredient.js'
import { RecipeWindow, InstructionList, IngredientList } from './RecipeWindow.js';
import { cleanup, screen, render } from '@testing-library/react';

describe('RecipeView tests', () => {

});

describe('InstructionList tests', () => {
    afterEach(cleanup);

    test('displays a list of instructions', () => {
        let testInstr = ["heat stove", "cover pan in oil", "add batter", "cook"];
        render(<InstructionList instr={testInstr} />);
        testInstr.forEach((value, index) => {
            expect(screen.getByText(value)).toBeInTheDocument();
        });
    });

});

describe('IngredientList tests', () => {
    afterEach(cleanup);

    test('displays a list of one ingredient', () => {
        let testIngredients =
            [
                new Ingredient("flour", 1.5, "cups")
            ];
        render(<IngredientList ingr={testIngredients} />);
        expect(screen.getByRole("listitem")).toHaveTextContent("flour, 1.5 cups");
    });

    test('displays an ingredient without a unit', () => {
        let testIngredients = [new Ingredient("egg", 1)];
        render(<IngredientList ingr={testIngredients} />);
        expect(screen.getByRole("listitem")).toHaveTextContent("egg, 1");

    });

    test('displays a list of ingredients', () => {
        let testIngredients =
            [
                new Ingredient("flour", 1.5, "cups"),
                new Ingredient("baking powder", 3.5, "tsp"),
                new Ingredient("salt", 1, "tsp"),
            ];
        render(<IngredientList ingr={testIngredients} />);
        expect(screen.getByText("flour, 1.5 cups")).toBeInTheDocument;
        expect(screen.getByText("baking powder, 3.5 tsp")).toBeInTheDocument;
        expect(screen.getByText("salt, 1 tsp")).toBeinTheDocument;
    });
});