import React, {useState} from 'react';
import { Recipe } from '../Model/recipe.js';

import Card from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import backImg from './../img/icons8-go-back-48.png';

/*
 *@prop recipe: the Recipe object containing info about the recipe to display.
 */
const RecipePage = ({recipe}) => {
    const [description, setDescription] = useState(recipe.desc != null ? recipe.desc : '')
    const [rating, setRating] = useState(recipe.stars != null ? recipe.stars : 0)

    return (
        <Grid container spacing={4}>
            <Grid container item xs={12} spacing={3} justify='space-between' alignItems='flex-end'>
                <Grid item>
                    <Typography variant="h2">
                        {recipe.name}
                    </Typography>
                </Grid>
                <Grid item >
                    <Typography variant="h4">
                        {recipe.timeToMake} {recipe.timeToMakeUnit}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Paper>
                    <DescriptionRating desc={description} setDesc = {setDescription} rating={rating} setRating = {setRating} />
                </Paper>
            </Grid>
            <Grid item  xs={12}>
                <Paper>
                    <Typography variant="h5" gutterBottom>
                        Ingredients
                    </Typography>
                    <IngredientList ingr={recipe.ingredients} />
                </Paper>
            </Grid>
            <Grid item  xs={12} >
                <Paper>
                    <Typography variant="h5" gutterBottom>
                        Serving Info
                    </Typography>
                    {servingInfoList(recipe.getServingInfo())}
                </Paper>
            </Grid>
            <Grid item xs={12} >
                <Paper>
                    <Typography variant="h5" gutterBottom>
                        Instructions
                    </Typography>
                    <InstructionList instr={recipe.instructions} />
                </Paper>
            </Grid>
        </Grid>
    );
    
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



/*
 *@param props = {
 *  desc: recipe description; string
 *  stars: number of recipe stars; number
 * } 
 */
const DescriptionRating = ({desc, setDesc, rating, setRating}) => {
    const [descriptionEditable, setDescriptionEditable] = useState(false)
    const handleChangeDesc = (newDesc) => {
        setDesc(newDesc)
        console.log('New description is' + newDesc)
    }

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
                <TextField
                    name = "fieldDescription"
                    disabled = {!descriptionEditable}
                    defaultValue= {desc} 
                    onChange = {(event) => handleChangeDesc(event.target.value)}/>
                <IconButton onClick = {() => setDescriptionEditable(!descriptionEditable)}>
                    <EditIcon />
                </IconButton>
            </Grid>
            <Grid item xs={6}>
                <Rating name = "rating" 
                        value = {rating}
                        preciscion = {0.5}
                        onChange = {(event, newRating) => setRating(newRating) }/>
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


export { RecipePage, InstructionList, IngredientList };