class Measurable {
    /*
     * @param name: the ingredient name; string
     * @param amount: amount of ingredient; number
     * @param unit: unit of measurement; string
     */
    constructor(name, amount, unit) {
        this.mName = name;
        this.mAmount = amount;
        if (unit == null) {
            unit = "";
        }
        else {
            this.mUnit = unit;
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
     * @param nutrients: the nutrients in the ingredient; array of Nutrient
     * @param fdcInfo: info about ingredient in fdc database; object
     */
    constructor(name, amount, unit, nutrients, fdcInfo) {
        super(name, amount, unit);
        this.mNutrients = nutrients;
        this.mFdcInfo = fdcInfo;

    }
    get nutrients() {
        return this.mNutrients;
    }
    set nutrients(newNutrients) {
        this.mNutrients = newNutrients;
    }
    get fdcInfo() {
        return this.mFdcInfo;
    }
    set fdcInfo(newInfo) {
        this.mFdcInfo = newInfo;
    }
}


class Nutrient extends Measurable {

}

export { Nutrient, Ingredient, Measurable };