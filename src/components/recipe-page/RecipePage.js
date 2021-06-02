import React, {useState, useEffect, useRef, useReducer} from 'react';
import Button from '@material-ui/core/Button'
import CancelIcon from '@material-ui/icons/Cancel'
import EditIcon from '@material-ui/icons/Edit';
import Fab from '@material-ui/core/Fab'
import Grid from '@material-ui/core/Grid';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { useHistory} from 'react-router';

import DescriptionRating from './DescriptionRating'
import ErrorMessenger from '../../Model/errorMessenger'
import recipeService from '../../services/recipeService'
import { RecipeName } from './RecipeName'
import { ServingInfoList } from './ServingInfoList'
import { TimingInfo } from './TimingInfo'
import { InstructionList } from './InstructionList'
import Instruction from '../../Model/instruction'
import { IngredientList } from './IngredientList'


//errors is an instance of the ErrorMessenger class
function reduceErrors(errors, action){
  const newErrors = new ErrorMessenger(errors)
  switch(action.type) {
    case 'add':
      return newErrors.addError(action.errorKey, action.errorMessage);
    case 'remove':
      return newErrors.removeError(action.errorKey);
    case 'reset':
      return new ErrorMessenger();
  }
}

/*
 *@prop recipe: the Recipe object containing info about the recipe to display.
 */
const RecipePage = ({recipe, prevPath, handleAddRecipe, handleUpdateRecipe}) => {
    const history = useHistory();
    const [errors, dispatchErrors] = useReducer(reduceErrors, new ErrorMessenger())

    //recipe state
    const [id, setId] = useState(recipe != null ? recipe.id : null)
    const [name, setName] = useState(recipe != null && recipe.name != null ? recipe.name : '')
    const [description, setDescription] = useState(recipe != null && recipe.description != null ? recipe.description : '')
    const [instructions, setInstructions] = useState(recipe != null && recipe.instructions != null ? recipe.instructions : [])
    const [ingredients, setIngredients] = useState(recipe != null && recipe.ingredients != null ? recipe.ingredients : [])
    const [rating, setRating] = useState(recipe != null && recipe.rating != null ? recipe.rating : 0)
    const [timeToMake, setTimeToMake] = useState(recipe != null ? recipe.timeToMake : null)
    const [servingInfo, setServingInfo] = useState(recipe != null ? recipe.servingInfo : null)
    const [editable, setEditable] = useState(false)
    const [created, setCreated] = useState(recipe != null)
    
    
    useEffect(() => {
      let instr;
      if(recipe != null && recipe.instructions != null){
        instr = Array.from(recipe.instructions)
      }
      else{
        instr = []
      }

      let newInstructions = instr.map((text) =>  new Instruction(text));
      setInstructions(newInstructions)
    }, [recipe])


    const checkRecipeForErrors = (recipe) => {
      let errorList = []
      if(recipe.name == undefined || recipe.name.trim() == ''){
        errorList.push('Recipe name is missing')
      }

      if(recipe.instructions.some((instruction) => instruction.trim() == '')){
        errorList.push('Blank instruction')
      }

      if(recipe.ingredients.some(ingredient => ingredient.name == undefined || ingredient.name.trim() == '')){
        errorList.push('An ingredient is missing a name')
      }

      if(recipe.ingredients.some(ingredient => ingredient.amount == undefined || ingredient.amount == 0)){
        errorList.push('An ingredient is missing an amount')
      }

      return errorList
    }

    const displayErrors = (errorList) => {
      let errorText = errorList.reduce((text, error, index) => { return text + `${error}\n` }, '');
      window.alert("Errors: \n" + errorText)
    }


    const handleSave = async () => {
      if(errors.size() == 0){
        setEditable(false);
        let newRecipe = {...recipe}
        newRecipe.name = name
        newRecipe.description = description
        newRecipe.instructions = instructions.map(instr => instr.text)
        newRecipe.ingredients = ingredients
        newRecipe.rating = rating
        newRecipe.timeToMake = timeToMake
        newRecipe.servingInfo = servingInfo
        let errorList = checkRecipeForErrors(newRecipe)

        if(errorList.length != 0){
          displayErrors(errorList)
        }
        else if(created){
          try{
            newRecipe = await recipeService.update(newRecipe)
          }catch(error){
            console.log(error)
          }
          
          handleUpdateRecipe(newRecipe)
        }else{
          try{
            newRecipe = await recipeService.create(newRecipe)
          }
          catch(error){
            console.log(error)
          }
          
          handleAddRecipe(newRecipe)
          history.replace(`${prevPath}/${newRecipe.id}`)
        }
      }
    }
    
    const restoreDefaultState = () => {
      setName(recipe != null && recipe.name != null ? recipe.name : '')
      setDescription(recipe != null && recipe.description != null ? recipe.description : '')
      let newInstructions = []
      if(recipe != null && recipe.instructions != null){
        newInstructions = recipe.instructions.map((text) =>  new Instruction(text))
      }
      else{
        setInstructions(newInstructions)
      }
    
      setIngredients(recipe != null && recipe.ingredients != null ? recipe.ingredients : [])
      setRating(recipe != null && recipe.rating != null ? recipe.rating : 0)
      setTimeToMake(recipe != null ? recipe.timeToMake : null)
      setServingInfo(recipe != null ? recipe.servingInfo : null)
      setId(recipe != null ? recipe.id : null)
      dispatchErrors({type: 'reset'})
    }

    const changeEditable = () => {
      if(editable){
        restoreDefaultState()
      }
      setEditable(!editable)
    }

    const addIngredient = function(newIngredient){
      let newIngredients = Array.from(ingredients)
      newIngredients.push(newIngredient)
      setIngredients(newIngredients)
      
    }

    const removeIngredient = function(ingredientToRemove){
      let newIngredients = ingredients.filter((ingredient) => ingredient.id !== ingredientToRemove.id)
      setIngredients(newIngredients)
    }

    const editIngredient = function(editedIngredient){
      let newIngredients = ingredients.map(ingredient => ingredient.id === editedIngredient.id ? editedIngredient : ingredient)
      setIngredients(newIngredients)
    }

    const addInstruction = function(newInstruction){
      let newInstructions = Array.from(instructions)
      newInstructions.push(newInstruction)
      setInstructions(newInstructions)
    }
  
    const removeInstruction = function(index){
      let newInstructions = Array.from(instructions)
      newInstructions.splice(index,1)
      setInstructions(newInstructions)
    }
  
    
    const editInstruction = function(index, newInstructionText){
      let newInstructions = Array.from(instructions)
      newInstructions[index].text = newInstructionText
      setInstructions(newInstructions)
    }

    let saveButton = null;
    if(editable){
        let text = created ? "Save Changes" : "Create Recipe"
        saveButton = ( 
        <Button 
          variant = "outlined" 
          color = "primary" 
          onClick = {() => handleSave()}
          disabled = {errors.size() != 0}
          data-testid = "saveButton"
        >
          {text}
        </Button>
        );
    } 

    return (
      <Grid container spacing={4}>
          <Grid container item xs={12} spacing={3} justify='space-between' alignItems='flex-end'>
              <Grid item>
                <RecipeName 
                  recipeName = {name} 
                  setRecipeName = {setName} 
                  editable = {editable} 
                  errors = {errors}
                  dispatchErrors = {dispatchErrors}
                />
              </Grid>
              <Grid item >
                <TimingInfo 
                  timeToMake = {timeToMake} 
                  setTimeToMake = {setTimeToMake} 
                  editable = {editable} 
                  errors = {errors}
                  dispatchErrors = {dispatchErrors}
                />
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
                    dispatchErrors = {dispatchErrors}
                  />
              </Paper>
          </Grid>
          <Grid item  xs={12} >                    
              <ServingInfoList 
              servingInfo = {servingInfo} 
              setServingInfo = {setServingInfo} 
              editable = {editable}
              errors = {errors}
              dispatchErrors = {dispatchErrors} />
          </Grid>
          <Grid item xs={12} >
            <Paper>
              <Typography variant="h5" gutterBottom>
                  Instructions
              </Typography>
              <InstructionList 
                instructions={instructions}
                editable = {editable}
                handleAdd = {addInstruction}
                handleRemove = {removeInstruction}
                handleEdit = {editInstruction} />
            </Paper>
          </Grid>
          <Grid item xs = {12} >
            {saveButton}
            <Fab 
              data-testid = "editButton" 
              alt ="Edit recipe" 
              color = {editable === false ? "primary" : "secondary" } 
              onClick = {() => changeEditable()}
              >
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