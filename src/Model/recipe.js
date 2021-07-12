//import { Nutrient, Ingredient, Measurable } from './ingredient.js';
import { uniqueId } from "lodash";

//A class describing a cooking recipe
export class Recipe {
    /*
    * @param name: the recipe name; string
    * @param desc: description of recipe; string
    * @param instr: a list of instructions; array of string
    * @param ingredients: a list of ingredients; array of Ingredient object
    */
    constructor(name,id,desc,instr, ingredients) {
        this.mName = name;
        this.mDesc = desc;
        this.mId = id ? id : uniqueId();

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
        this.mServingInfo = {
            numServed: 0,
            yield: 0,
            servingSize: 0,
            unit: ""
        }
        this.mStars = 0;
        this.mTimeToMake = 0;
        this.mTimeToMakeUnit = ""; //enum
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
        this.servingInfo = servingInfo
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
        return this.servingInfo;
    }
    get id(){
        return this.mId;
    }
    set id(newId){
        this.mId = newId;
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

