import React from 'react';
import { Recipe } from '../Model/recipe.js';
const backImg = require('../img/icons8-go-back-48.png');
const starImg = require('../img/icons8-star-48.png');

/*
 *@prop recipe: the Recipe object containing info about the recipe to display.
 */
class RecipeWindow extends React.Component {
    /*
     *@param mRecipe: the Recipe object containing info about the recipe to display.
     */
    constructor(props) {
        super(props);
        this.mRecipe = props.recipe;
    }
    render() {
        return (
            <div className="recipeWindow">
                <img src={backImg} alt="Back" width="48" height="48" />
                <h2>{this.mRecipe.name}</h2>
                <p>{this.mRecipe.timeToMake} {this.mRecipe.timeToMakeUnit}</p>
                <p>{this.mRecipe.stars}</p><img src={starImg} alt = "stars" />
                <p>{this.mRecipe.desc}</p>
                <IngredientList ingr={this.mRecipe.ingredients} />
                <InstructionList instr={this.mRecipe.instructions} />
            </div>
        );
    }
}
class InstructionList extends React.Component {
    constructor(props) {
        super(props);
        if (props.instr != null) {
            this.mInstructions = [].concat(props.instr);
        }
        else {
            this.mInstructions = [];
        }
        
    }
    render() {
        let content = this.mInstructions.map((value,index) => {
            return (<li key={index}> {value} </li>);
        });
        return (<ol>
                {content}
                </ol>
            );
    }
}

class IngredientList extends React.Component {
    constructor(props) {
        super(props);
        this.mIngredients = props.ingr;
        if (props.ingr != null) {
            this.mIngredients = [].concat(props.ingr);
        }
        else {
            this.mIngredients = [];
        }
    }
    render() {
        let content = this.mIngredients.map((value, index) => {
            return (<li key={value.name}>{value.toString()}</li>);
        });
        return (<ul>
                {content}
                </ul>
        );

    }
}


export { RecipeWindow, InstructionList, IngredientList };