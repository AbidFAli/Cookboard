import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import { cloneDeep } from 'lodash';
import React, { useEffect, useReducer, useState } from 'react';
import { useHistory } from 'react-router';
import ErrorMessenger from '../../Model/errorMessenger';
import { Ingredient } from '../../Model/ingredient';
import Instruction from '../../Model/instruction';
import recipeService from '../../services/recipeService';
import { DescriptionRating } from './DescriptionRating';
import { IngredientList } from './IngredientList';
import { InstructionList } from './InstructionList';
import { RecipeName } from './RecipeName';
import { ServingInfoList } from './ServingInfoList';
import { TimingInfo } from './TimingInfo';


const ID_EDIT_BUTTON = "editButton"
const ID_SAVE_BUTTON = "saveButton"

const KEY_RECIPE_BEFORE_EDITS = "keyRecipeBeforeEdits"

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
    default:
      return newErrors
  }
}

/*
 *@prop id: the id of the recipe to display;
 *  @type null || string
 *@prop name: the name of the recipe to display;
 *  @type null || string
 *@prop prevPath: the path to the previous page
 *@prop user: the logged in user
 *  @type User || null
 *@prop handleAddRecipe
 *  @type function handleAddRecipe(recipe: Recipe)
 *@prop handleUpdateRecipe
 *  @type function handleUpdateRecipe(recipe: Recipe) 
 */
const RecipePage = (props) => {
    const history = useHistory();
    const [errors, dispatchErrors] = useReducer(reduceErrors, new ErrorMessenger())

    
    //recipe state
    const [name, setName] = useState(props.name ?? '')
    const [description, setDescription] = useState('')
    const [instructions, setInstructions] = useState([])
    const [ingredients, setIngredients] = useState([])
    const [rating, setRating] = useState(0)
    const [timeToMake, setTimeToMake] = useState(null)
    const [servingInfo, setServingInfo] = useState(null)
    const [editable, setEditable] = useState(props.id == null)
    const [created, setCreated] = useState(props.id != null)
    

    useEffect(() => { 
      if(props.id){
        recipeService.getById(props.id).then((recipe) => {
          setPageState(recipe)
        })
      }
    }, [props.id] );

    
    const checkRecipeForErrors = (recipe) => {
      let errorList = []
      if(recipe.name == null || recipe.name.trim() === ''){
        errorList.push('Recipe name is missing')
      }

      if(recipe.instructions.some((instruction) => instruction.trim() === '')){
        errorList.push('Blank instruction')
      }

      if(recipe.ingredients.some(ingredient => ingredient.name == null || ingredient.name.trim() === '')){
        errorList.push('An ingredient is missing a name')
      }

      if(recipe.ingredients.some(ingredient => ingredient.amount == null || ingredient.amount === 0)){
        errorList.push('An ingredient is missing an amount')
      }

      return errorList
    }

    const displayErrors = (errorList) => {
      let errorText = errorList.reduce((text, error, index) => { return text + `${error}\n` }, '');
      window.alert("Errors: \n" + errorText)
    }


    const handleSave = async () => {
      if(errors.size() === 0){
        
        let newRecipe = {
          name: name.trim(), 
          description,
          rating,
          timeToMake,
          servingInfo,
          instructions: instructions.map(instr => instr.text),
          ingredients: cloneDeep(ingredients),
        }
        if(props.id){
          newRecipe.id = props.id
        }

        newRecipe.ingredients.forEach((ingredient) => {
          if(Ingredient.hasTempId(ingredient)){
            delete ingredient.id
          }
        })
        let errorList = checkRecipeForErrors(newRecipe)

        if(errorList.length !== 0){
          displayErrors(errorList)
        }
        else if(created){
          try{
            newRecipe = await recipeService.update(newRecipe, props.user)
            props.handleUpdateRecipe(newRecipe)
            setEditable(false);
          }catch(error){
            console.log(error)
          }
        }else{
          try{
            newRecipe = await recipeService.create(newRecipe, props.user)
            props.handleAddRecipe(newRecipe)
            history.push(`${props.prevPath}/${newRecipe.id}`)
            setEditable(false);
          }
          catch(error){
            console.log(error)
          }
        }
      }
    }

    const setPageState = (recipe) => {
      setName(recipe != null && recipe.name != null ? recipe.name : '')
      setDescription(recipe != null && recipe.description != null ? recipe.description : '')
      let newInstructions = []
      if(recipe != null && recipe.instructions != null){
        newInstructions = recipe.instructions.map((text) =>  new Instruction(text))
      }
    
      setInstructions(newInstructions)
      setIngredients(recipe != null && recipe.ingredients != null ? recipe.ingredients : [])
      setRating(recipe != null && recipe.rating != null ? recipe.rating : 0)
      setTimeToMake(recipe != null ? recipe.timeToMake : null)
      setServingInfo(recipe != null ? recipe.servingInfo : null)
    }
    
    const restoreRecipeBeforeEdits = async () => {
      let recipeBeforeEdits = window.sessionStorage.getItem(KEY_RECIPE_BEFORE_EDITS)
      recipeBeforeEdits = JSON.parse(recipeBeforeEdits)
      setPageState(recipeBeforeEdits)
    }

    const changeEditable = async () => {
      dispatchErrors({type: 'reset'})
      if(created && editable){
        await restoreRecipeBeforeEdits()
      }
      else if(created){
        saveRecipeLocally()
      }
      setEditable(!editable)
    }

    const saveRecipeLocally = () => {
      let recipeToSave = {
        id: props.id,
        name, 
        description, 
        instructions : instructions.map(instr => instr.text),
        ingredients,
        rating,
        timeToMake,
        servingInfo
      }
      let recipeData = JSON.stringify(recipeToSave)
      window.sessionStorage.setItem(KEY_RECIPE_BEFORE_EDITS, recipeData)
    }

    const addIngredient =  function(newIngredient){
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
          disabled = {errors.size() !== 0}
          data-testid = {ID_SAVE_BUTTON}
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
              data-testid = {ID_EDIT_BUTTON} 
              alt = {editable ? "Cancel edit" : "Edit recipe" }
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

export {
  RecipePage,
  ID_EDIT_BUTTON,
  ID_SAVE_BUTTON
};

