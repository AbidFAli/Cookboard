import React, {useState} from 'react';
import Button from '@material-ui/core/Button'
import CancelIcon from '@material-ui/icons/Cancel'
import EditIcon from '@material-ui/icons/Edit';
import Fab from '@material-ui/core/Fab'
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import recipeService from '../../services/recipeService'
import DescriptionRating from './DescriptionRating'
import RecipeName from './RecipeName'
import ServingInfoList from './ServingInfoList'
import TimingInfo from './TimingInfo'
import { InstructionList } from './InstructionList'
import { IngredientList } from './IngredientList'
import { useHistory} from 'react-router';




/*
 *@prop recipe: the Recipe object containing info about the recipe to display.
 */
const RecipePage = ({recipe, prevPath, handleAddRecipe}) => {
    const history = useHistory();

    //recipe state
    const [name, setName] = useState(recipe != null ? recipe.name : '')
    const [description, setDescription] = useState(recipe != null ? recipe.description : '')
    const [instructions, setInstructions] = useState(recipe != null ? recipe.instructions : [])
    const [ingredients, setIngredients] = useState(recipe != null ? recipe.ingredients : [])
    const [rating, setRating] = useState(recipe != null ? recipe.stars : 0)
    const [timeToMake, setTimeToMake] = useState(recipe != null ? recipe.timeToMake : null)
    const [servingInfo, setServingInfo] = useState(recipe != null ? recipe.servingInfo : null)
    
    const [editable, setEditable] = useState(false)
    const [created, setCreated] = useState(recipe != null)
    
    const handleSave = async () => {
      setEditable(false);
      let newRecipe = {...recipe}
      newRecipe.name = name
      newRecipe.description = description
      newRecipe.instructions = instructions
      newRecipe.ingredients = ingredients
      newRecipe.rating = rating
      newRecipe.timeToMake = timeToMake
      newRecipe.servingInfo = servingInfo
      if(created){
        newRecipe = await recipeService.update(newRecipe)
      }else{
        newRecipe = await recipeService.create(newRecipe)
      }
      
      handleAddRecipe(newRecipe)
      history.replace(`${prevPath}/${newRecipe.id}`)
      //TODO: navigate to the recipe's actual page
    }

    const addIngredient = function(newIngredient){
      let newIngredients = Array.from(ingredients)
      newIngredients.push(newIngredient)
      setIngredients(newIngredients)
    }

    const removeIngredient = function(index){
      let newIngredients = Array.from(ingredients)
      newIngredients.splice(index,1)
      setIngredients(newIngredients)
    }

    const editIngredient = function(index, editedIngredient){
      let newIngredients = Array.from(ingredients)
      newIngredients[index] = editedIngredient
      setIngredients(newIngredients)
    }

    let saveButton = null;
    if(editable){
        let text = created ? "Save Changes" : "Create Recipe"
        saveButton = ( <Button variant = "outlined" color = "primary" onClick = {() => handleSave()}>{text}</Button>);
    } 

    return (
      <Grid container spacing={4}>
          <Grid container item xs={12} spacing={3} justify='space-between' alignItems='flex-end'>
              <Grid item>
                  <RecipeName recipeName = {name} setRecipeName = {setName} editable = {editable} />
              </Grid>
              <Grid item >
                  <TimingInfo timeToMake = {timeToMake} setTimeToMake = {setTimeToMake} editable = {editable} />
              </Grid>
          </Grid>
          <Grid item xs={12}>
              <Paper>
                  <DescriptionRating 
                      desc={description} 
                      setDesc = {setDescription}
                      rating={rating}
                      setRating = {setRating} 
                      editable = {editable}/>
              </Paper>
          </Grid>
          <Grid item  xs={12}>
              <Paper>
                  <Typography variant="h5" gutterBottom>
                      Ingredients
                  </Typography>
                  <IngredientList 
                    ingredients={ingredients} 
                    editable = {editable} 
                    handleRemove = {removeIngredient}
                    handleAdd = {addIngredient}
                    handleEdit = {editIngredient}
                  />
              </Paper>
          </Grid>
          <Grid item  xs={12} >                    
              <ServingInfoList 
              servingInfo = {servingInfo} 
              setServingInfo = {setServingInfo} 
              editable = {editable} />
          </Grid>
          <Grid item xs={12} >
              <Paper>
                  <Typography variant="h5" gutterBottom>
                      Instructions
                  </Typography>
                  <InstructionList instructions={instructions} setInstructions = {setInstructions} editable = {editable} />
              </Paper>
          </Grid>
          <Grid item xs = {12} >
            {saveButton}
            <Fab name = "editButton" color = {editable === false ? "primary" : "secondary" } onClick = {() => setEditable(!editable)}>
              {
                editable
                ? <CancelIcon/>
                : <EditIcon/>
              }
            </Fab>
          </Grid>
      </Grid>
    );
    
}

export { RecipePage};