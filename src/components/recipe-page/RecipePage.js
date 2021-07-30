import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import Rating from '@material-ui/lab/Rating';
import { cloneDeep } from 'lodash';
import React, { useEffect, useReducer, useState } from 'react';
import { useHistory } from 'react-router';
import { ErrorMessenger, reduceErrors } from '../../Model/errorMessenger';
import { Ingredient } from '../../Model/ingredient';
import Instruction from '../../Model/instruction';
import { PATH_LOGIN } from '../../paths';
import recipeService from '../../services/recipeService';
import { isTokenExpiredError } from '../../util/errors';
import { Description } from './Description';
import { IngredientList } from './IngredientList';
import { InstructionList } from './InstructionList';
import { RecipeName } from './RecipeName';
import { ServingInfoList } from './ServingInfoList';
import { TimingInfo } from './TimingInfo';

const TEXT_CONFIRM_DELETE = "Are you sure you want to delete this recipe?"

const ID_EDIT_BUTTON = "idRecipePage_editButton"
const ID_CANCEL_BUTTON = "idRecipePage_cancelEditsButton"
const ID_SAVE_BUTTON = "idRecipePage_saveButton"
const ID_RATING_SLIDER = "idRecipePage_RatingSlider"
const ID_DELETE_BUTTON = "idRecipePage_deleteButton"

const KEY_RECIPE_BEFORE_EDITS = "keyRecipeBeforeEdits"
const MESSAGE_RECIPE_LOADED = "Recipe loaded."
const MESSAGE_TOKEN_EXPIRED = "It has been too long since your last login. Please log in again."


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
 *  should only be called on save
 *@prop handleUpdateRecipe
 *  @type function handleUpdateRecipe(recipe: Recipe) 
 *  should only be called on save
 *@prop handleDeleteRecipe
 * @type function handleDeleteRecipe(recipeId: string)
 *@prop snackbarRef
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
    
    //page control state
    const [editable, setEditable] = useState(props.id == null)
    const [created, setCreated] = useState(props.id != null)
  
    
    useEffect(() => { 
      if(props.id){
        recipeService.getById(props.id).then((recipe) => {
          props.snackbarRef.current.displayMessage(MESSAGE_RECIPE_LOADED)
          setPageState(recipe)
        })
      }
    }, [props.id]);

    const handleRecipeServiceError = (error) => {
      if(isTokenExpiredError(error)){
          history.push(PATH_LOGIN)
          props.snackbarRef.current.displayMessage(MESSAGE_TOKEN_EXPIRED)
      }
      else{
        console.log(error)
      }
    }

    const handleDeleteRecipe = async () => {
      try{
        if(window.confirm(TEXT_CONFIRM_DELETE)){
          await recipeService.destroy(props.id, props.user)
          history.push(props.prevPath)
          props.handleDeleteRecipe(props.id)
        }
      }
      catch(error){
        handleRecipeServiceError(error)
      }

    }


    const getRecipeStateToSave = ()  => {
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
      
      //get rid of ids for any ingredients with temporary ids
      newRecipe.ingredients.forEach((ingredient) => {
        if(Ingredient.hasTempId(ingredient)){
          delete ingredient.id
        }
      })

      return newRecipe;
    }

    const handleUpdate = async () => {
      if(errors.size() === 0){
        let newRecipe = getRecipeStateToSave()
        try{
          newRecipe = await recipeService.update(newRecipe, props.user)
          setPageState(newRecipe)
          props.handleUpdateRecipe(newRecipe)
          setEditable(false);
        }catch(error){
          handleRecipeServiceError(error)
        }
      }
    }

    const handleCreate = async () => {
      if(errors.size() === 0){
        let newRecipe = getRecipeStateToSave()
        try{
          newRecipe = await recipeService.create(newRecipe, props.user)
          setCreated(true);
          props.handleAddRecipe(newRecipe)
          history.replace(`${props.prevPath}/${newRecipe.id}`)
          setEditable(false);
        }
        catch(error){
          handleRecipeServiceError(error)
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

    //refactor this into multiple functions?
    const changeEditable = async () => {
      dispatchErrors({type: 'reset'})
      if(created && editable){
        await restoreRecipeBeforeEdits()
      }
      else if(!created && editable){
        history.push(props.prevPath)
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

    //below here can be made into reducer functions to clean up this class
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
          onClick = {() => created ? handleUpdate() : handleCreate()}
          disabled = {errors.size() !== 0}
          data-testid = {ID_SAVE_BUTTON}
        >
          {text}
        </Button>
        );
    }

    let deleteButton = null;
    if(created){
      deleteButton = (
        <Button onClick = {handleDeleteRecipe} data-testid = {ID_DELETE_BUTTON} variant = "outlined" color = "primary">
          Delete Recipe
        </Button>
      )
    }
    let floatingActionButton = (
      <Fab
      data-testid = {editable ? ID_CANCEL_BUTTON : ID_EDIT_BUTTON} 
      color = {editable === false ? "primary" : "secondary" }
      onClick = {() => changeEditable()}>
      { editable ? <CancelIcon/> : <EditIcon/> }
      </Fab>
    )
    
    //Good example of a split left/right layout.
    let buttonBar = (
      <React.Fragment>
        <Grid container item xs = {12} md = {6} spacing = {2}>
          <Grid item>
            {floatingActionButton}
          </Grid>
          <Grid item>
            {saveButton}
          </Grid>
        </Grid>
        <Grid container item xs = {12} md = {6} justify = "flex-end">
          <Grid item>
            {deleteButton}
          </Grid>
        </Grid>
      </React.Fragment>
    )

    
    let descriptionLayout = (  
      <Grid container item xs = {6} direction = "column">
        <Grid item >
          <Typography variant="h5" gutterBottom>
              Description
          </Typography>
        </Grid>
        <Grid item >
          <Description 
            desc={description} 
            setDesc = {setDescription}
            editable = {editable} />
        </Grid>
      </Grid>
    )

    let ratingLayout = (
      <Grid container item xs = {6} direction = "column">
        <Grid item>
          <Typography variant="h5" gutterBottom>
              Rating
          </Typography>
        </Grid>
        <Grid item>
          <Rating
            name = {ID_RATING_SLIDER}
            value = {rating}
            readOnly = {!editable}
            preciscion = {0.5}
            onChange = {(event, newRating) => setRating(newRating) }
          />
        </Grid>
      </Grid>
    )



    return (
      <React.Fragment>

      
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
          <Grid item xs = {12}>
            <Paper>
            <Grid container item xs = {12} direction = "row">
              {descriptionLayout}
              {ratingLayout}
            </Grid >
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
                handleEdit = {editInstruction}
                dispatchErrors = {dispatchErrors} />
            </Paper>
          </Grid>
          <Grid container item xs = {12}>
            {buttonBar}
          </Grid>
      </Grid>
      </React.Fragment>
      
    );
    
}

export {
  RecipePage,
  ID_EDIT_BUTTON,
  ID_SAVE_BUTTON,
  MESSAGE_RECIPE_LOADED,
  ID_CANCEL_BUTTON,
  ID_DELETE_BUTTON,
  MESSAGE_TOKEN_EXPIRED
};

