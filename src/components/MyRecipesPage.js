import React from 'react';
import { Recipe } from '../Model/recipe.js';

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
import Typography from '@material-ui/core/Typography';

import {
    BrowserRouter as Router,
    useRouteMatch, useHistory,
    Switch, Route
} from "react-router-dom"

import { RecipePage } from './RecipePage.js';



//onClick={() => <Redirect to={`${props.path}/${index}`} 

/*
 * @param props = {
 * recipes : a list of recipes; array of Recipe
 * path: current path of the MyRecipesPage housing the RecipeList
 * }
 */
const RecipeList = (props) => {
    let content;
    const history = useHistory();
    if (props.recipes != null) {
        content = props.recipes.map((value, index) => {
            return (
                <List component="ul">
                    <ListItem key={index} button onClick={() => history.push(`${props.path}/${index}`)}>
                        <ListItemIcon>
                            <RestaurantRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary={value.name} />
                        <ListItemSecondaryAction>
                            </ListItemSecondaryAction>
                    </ListItem>
                </List>
            );
        });
    }
    return content;
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
    let { path, url } = useRouteMatch();
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
                    <RecipeList recipes={props.recipes} path={path} />
                </Paper>
            </Grid>
            <Grid item>
                <Fab color="primary" aria-label="add">
                    <AddIcon />
                </Fab>
            </Grid>
        </Grid>
    );

    return (
        <Router>
            <Switch>
                <Route path={`${path}/:recipeId`}
                    render={({ match }) => (
                        <RecipePage recipe={props.recipes[match.params.recipeId]} />
                    )}
                />
                <Route exact path={path}>
                    {page}
                </Route>
            </Switch>
        </Router>

        );
    
}