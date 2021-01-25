import React from 'react';
import { Recipe } from '../Model/recipe.js';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Paper';

import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';

import backImg from './../img/icons8-go-back-48.png';

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
            <Grid container spacing={4}>
                <Grid container item xs={12} spacing={3} justify='space-between' alignItems='flex-end'>
                    <Grid item>
                        <Typography variant="h2">
                            {this.mRecipe.name}
                        </Typography>
                    </Grid>
                    <Grid item >
                        <Typography variant="h4">
                            {this.mRecipe.timeToMake} {this.mRecipe.timeToMakeUnit}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Paper>
                        <DescriptionRating desc={this.mRecipe.desc} stars={this.mRecipe.stars} />
                    </Paper>
                </Grid>
                <Grid item xs={12} spacing={3}>
                    <Paper>
                        <Typography variant="h5" gutterBottom>
                            Ingredients
                        </Typography>
                        <IngredientList ingr={this.mRecipe.ingredients} />
                    </Paper>
                </Grid>
                <Grid item xs={12} spacing={3}>
                    <Paper>
                        <Typography variant="h5" gutterBottom>
                            Serving Info
                        </Typography>
                        {servingInfoList(this.mRecipe.getServingInfo())}
                    </Paper>
                </Grid>
                <Grid item xs={12} spacing={3}>
                    <Paper>
                        <Typography variant="h5" gutterBottom>
                            Instructions
                        </Typography>
                        <InstructionList instr={this.mRecipe.instructions} />
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

const servingInfoList = (props) => {
    return (
            <List component = "ul">
            <ListItem>
                <ListItemText primary={`Serves: ${props.numServed}`} />
            </ListItem>
            <ListItem>
                <ListItemText primary={`Yield: ${props.yield} servings`} />
            </ListItem>
            <ListItem>
                <ListItemText primary={`Serving size: ${props.servingSize} ${props.servingUnit}`} />
            </ListItem>
            </List>
    );
}

const generateStars = (numStars) => {
    let content = Array(5).fill(<StarBorderIcon />);

    for (let i = 0; i < numStars; i++) {
        content[i] = <StarIcon />;
    }
    return content;   
}

/*
 *@param props = {
 *  desc: recipe description; string
 *  stars: number of recipe stars; number
 * } 
 */
const DescriptionRating = (props) => {
    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography variant="h5" gutterBottom>
                    Description
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="h5" gutterBottom>
                    Rating
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="body1" >
                    {props.desc}
                </Typography>
            </Grid>
            <Grid item xs={6}>
                {generateStars(props.stars)}
            </Grid>
        </Grid>
        );
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
            return (<ListItem component="li">
                        <ListItemText primary={Recipe.printInstruction(value,index)}/>
                    </ListItem>);
        });
        return (
                <List component = "ol">
                {content}
                </List>
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
            return (<ListItem key={value.name}>
                        <ListItemText primary={value.toString()} />
                    </ListItem>);
        });
        return (
                <List component = "ul">
                {content}
                </List>
                
        );

    }
}


export { RecipeWindow, InstructionList, IngredientList };