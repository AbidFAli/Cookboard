
import uniqueId from 'lodash/uniqueId'

const TEMP_ID_FLAG = "TEMP"

class Measurable {
    /*
     * @param name: the ingredient name; string
     * @param amount: amount of ingredient; number
     * @param unit: unit of measurement; string
     */
    constructor(name, amount, unit) {
        this.mName = name ?? '';
        this.mAmount = amount ?? 1;

        if(unit != null && unit.trim() !== ''){
            this.mUnit = unit.trim();
        }
    }
    get name() {
        return this.mName;
    }
    set name(newName) {
        this.mName = newName;
    }
    get amount() {
        return this.mAmount;
    }
    set amount(newAmount) {
        this.mAmount = newAmount;
    }
    get unit() {
        return this.mUnit;
    }
    set unit(newUnit) {
        this.mUnit = newUnit;
    }
    toString() {
        return `${this.mName}, ${this.mAmount} ${this.mUnit}`;
    }
    /*
    convertUnit(newUnit) {

    }
    isSIUnit() {

    }
    */
}

//A class storing information about an ingredient in a recipe
class Ingredient extends Measurable {

    /*
     * @param name: the ingredient name; string
     * @param amount: amount of ingredient; number
     * @param unit: unit of measurement; string
     * @param id: id of the ingredient; string
 
     */
    constructor(name, amount, unit, id) {
        super(name, amount, unit);
        this.id = id ?? uniqueId(TEMP_ID_FLAG)
    }

    static hasTempId(ingredient){    
        if(ingredient.id){
            return ingredient.id.startsWith(TEMP_ID_FLAG);
        }
        else{
            return false
        }    
    }

    // get nutrients() {
    //     return this.mNutrients;
    // }
    // set nutrients(newNutrients) {
    //     this.mNutrients = newNutrients;
    // }
    // get fdcInfo() {
    //     return this.mFdcInfo;
    // }
    // set fdcInfo(newInfo) {
    //     this.mFdcInfo = newInfo;
    // }
}




export { Ingredient, Measurable };