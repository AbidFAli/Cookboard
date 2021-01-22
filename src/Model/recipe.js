import { Nutrient, Ingredient, Measurable } from './ingredient.js';

//A class describing a cooking recipe
export class Recipe {
    /*
    * @param name: the recipe name; string
    * @param desc: description of recipe; string
    * @param instr: a list of instructions; array of string
    * @param ingredients: a list of ingredients; array of Ingredient object
    */
    constructor(name,desc,instr, ingredients) {
        this.mName = name;
        this.mDesc = desc;

        if (this.mInstructions != null) {
            this.mInstructions = [].concat(instr);
        }
        else {
            this.mInstructions = [];
        }

        if (ingredients != null) {
            this.mIngredients = [].concat(ingredients);
        }
        else {
            this.mIngredients = [];
        }
        this.mStars = 0;
        this.mTimeToMake = 0;
        this.mTimeToMakeUnit = ""; //enum
        this.mNumServed = 0;
        this.mServings = 0;
        this.mServingsUnit = ""; //make this an enum
        this.mTotalCalories = 0;
    }
    get name() {
        return this.mName;
    }
    set name(newName) {
        this.mName = newName;
    }
    get desc() {
        return this.mDesc;
    }
    set desc(newDesc) {
        this.mDesc = newDesc;
    }
    get instructions() {
        return this.mInstructions;
    }
    set instructions(newInstructions) {
        this.mInstructions = newInstructions;
    }
    get stars() {
        return this.mStars();
    }
    set stars(newStars) {
        this.mStars = newStars;
    }
    get timeToMake() {
        return this.mTimeToMake;
    }
    set timeToMake(time) {
        this.mTimeToMake = time;
    }
    get timeToMakeUnit() {
        return this.mTimeToMakeUnit;
    }
    set timeToMakeUnit(newUnit) {
        this.mTimeToMakeUnit = newUnit;
    }
    get numServed() {
        return this.mNumServed;
    }
    set numServed(newNum) {
        this.mNumServed = newNum;
    }
    get servings() {
        return this.mServings;
    }
    set servings(newNum) {
        this.mServings = newNum;
    }
    get servingsUnit() {
        return this.mServingsUnit;
    }
    set servingsUnit(newUnit) {
        this.mServingsUnit = newUnit;
    }
    get totalCalories() {
        return this.mTotalCalories;
    }
    set totalCalories(newTotal) {
        this.mTotalCalories = newTotal;
    }
    get ingredients() {
        return this.mIngredients;
    }
    addIngredient(ingredient) {
        this.mIngredients.push(ingredient);
    }
    getIngredient(ingredientName) {
        return this.mIngredients.find((elem) => {
            return ingredientName.toUpperCase() === elem.name.toUpperCase();
        });
    }
}

