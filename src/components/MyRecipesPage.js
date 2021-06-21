import React, { useState, useEffect } from 'react';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Paper from '@material-ui/core/Paper';
import RestaurantRoundedIcon from '@material-ui/icons/RestaurantRounded';
import Radio from '@material-ui/core/Radio'
import Typography from '@material-ui/core/Typography';

import {
    useRouteMatch, useHistory,
    Switch, Route
} from "react-router-dom"

import { RecipePage } from './recipe-page/RecipePage';
import recipeService from '../services/recipeService'


//onClick={() => <Redirect to={`${props.path}/${index}`} 

/*
 * @param props = {
 * recipes : a list of recipes; array of Recipe
 * path: current path of the MyRecipesPage housing the RecipeList
 * }
 */
export function RecipeList(props){
    let content = null;
    const history = useHistory();
    const [selectedRecipe, setSelectedRecipe] = useState(null); //id of the selected recipe

    function handleCheck(event, recipe){
        setSelectedRecipe(recipe)
        console.log(`${recipe.name}'s check handler was called`)
    }

    if (props.recipes != null) {
        content = props.recipes.map((recipe, index) => {
            return (
                
                    <ListItem key={index} button onClick={() => history.push(`${props.path}/${recipe.id}`)}>
                        <ListItemIcon>
                            <RestaurantRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary={recipe.name} />
                        <ListItemSecondaryAction>
                            <Radio
                                edge="end"
                                onChange={(event) => handleCheck(event, recipe)  /* only fires when radio is clicked */}
                                checked = {selectedRecipe !== null && selectedRecipe.id === recipe.id}
                            />
                            </ListItemSecondaryAction>
                    </ListItem>
                
            );
        });
    }
    return (<List component="ul">{content}</List>);
}

const ButtonBar = (props) => {
    return (
        <ButtonGroup>
            <Button>Edit</Button>
            <Button>Delete</Button>
        </ButtonGroup>
    );
}


/*
 * @param props = {
 * recipes : a list of recipes; array of Recipe
 * }
 */
export function MyRecipesPage(props){
    const history = useHistory();
    let { path } = useRouteMatch();
    let [recipes, setRecipes] = useState([])

    useEffect(() => {
        recipeService.getAll().then((fetchedRecipes) => {
            setRecipes(fetchedRecipes)
        })
    }, []);

    const goToNew = () => {
        history.push(`${path}/new`)
        console.log(`${path}/new`)
    }

    const addRecipe = (newRecipe) => {
        let newRecipes = Array.from(recipes)
        newRecipes.push(newRecipe)
        setRecipes(newRecipes)
    }

    const updateRecipe = (editedRecipe) => {
        let newRecipes = recipes.filter(recipe => recipe.id !== editedRecipe.id)
        newRecipes.push(editedRecipe)
        setRecipes(newRecipes)
    }

    const removeRecipe = (recipeToRemove) => {
        let newRecipes = recipes.filter(recipe => recipe.id !== recipeToRemove.id)
        setRecipes(newRecipes)
    }

    let page = (
        <Grid container spacing={4}>
            <Grid container item xs={12} spacing={3} justify='center' alignItems='flex-end'>
                <Grid item>
                    <Typography variant="h2">
                        My Recipes
                    </Typography>
                </Grid>
            </Grid>
            <Grid container item xs={12} spacing={3} justify='center'>
                <Grid item>
                    <ButtonBar />
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Paper>
                    <RecipeList recipes={recipes} path={path} />
                </Paper>
            </Grid>
            <Grid item>
                <Fab color="primary" aria-label="add" onClick = {goToNew}>
                    <AddIcon />
                </Fab>
            </Grid>
        </Grid>
    );


    return (
            <Switch>
                <Route path = '/new'>
                    <RecipePage prevPath = {path} handleAddRecipe = {addRecipe} handleUpdateRecipe = {updateRecipe} />
                </Route>
                <Route path={`${path}/:recipeId`}
                    render={({ match }) => (
                        <RecipePage 
                            recipe={recipes.find(recipe => recipe.id === match.params.recipeId)} 
                            prevPath = {path}
                            handleAddRecipe = {addRecipe}
                            handleUpdateRecipe = {updateRecipe}
                            />
                    )}
                />
                <Route exact path={path}>
                    {page}
                </Route>
            </Switch>
        );
    
}