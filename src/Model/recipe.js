//import { Nutrient, Ingredient, Measurable } from './ingredient.js';

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

        if (instr != null) {
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
        this.mYield = 0; //number of servings created
        this.mServingSize = 0;
        this.mServingUnit = ""; //make this an enum
        this.mTotalCalories = 0;
    }
    /*
     * @param servingInfo = {
     * numServed: number of people service; number
     * yield: yield of the recipe; number
     * servingSize: serving size; number
     * servingUnit: serving unit; string
     * }
     * 
     */
    setServingInfo(servingInfo) {
        this.mNumServed = servingInfo.numServed;
        this.mYield = servingInfo.yield;
        this.mServingSize = servingInfo.servingSize;
        this.mServingUnit = servingInfo.servingUnit;
    }
    /*
     * @returns servingInfo = {
     * numServed: number of people service; number
     * yield: yield of the recipe; number
     * servingSize: serving size; number
     * servingUnit: serving unit; string
     * }
     */
    getServingInfo() {
        return {
            numServed: this.mNumServed,
            yield: this.mYield,
            servingSize: this.mServingSize,
            servingUnit: this.mServingUnit
        };
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
        return this.mStars;
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
    get yield() {
        return this.mYield;
    }
    set yield(newNum) {
        this.mYield = newNum;
    }
    get servingUnit() {
        return this.mServingUnit;
    }
    set servingsUnit(newUnit) {
        this.mServingUnit = newUnit;
    }
    get servingSize() {
        return this.mServingSize;
    }
    set servingSize(newSize) {
        this.mServingSize = newSize;
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
    /*
     * Helper function to print a formatted instruction
     * @param instr: the instruction; string
     * @param pos: position(starting from 0) in the list of instructions; number
     * @returns: a string;
     */
    static printInstruction(instr, pos) {
        return `${1 + pos}. ${instr}`;
    }
}

