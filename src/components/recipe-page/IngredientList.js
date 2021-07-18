import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { useEffect, useRef, useState } from 'react';
//import { ErrorMessenger } from '../../Model/errorMessenger';
//import {UnitedValue, ERROR_TYPE_UNIT, ERROR_TYPE_VALUE} from './UnitedValue'
import { Ingredient } from '../../Model/ingredient';



//Non-unique testids
const ID_DELETE_INGREDIENT_BUTTON = "deleteIngredientButton"
const ID_FIELD_INGREDIENT_AMOUNT ="ingredientAmountField"
const ID_FIELD_INGREDIENT_NAME = "ingredientNameField"
const ID_FIELD_INGREDIENT_UNIT = "ingredientUnitField"

//Unique testIds

const ID_BUTTON_ADD_INGREDIENT = "startAddButton"

//Error Keys
const ERROR_KEY_INGREDIENT_LIST = "keyErrorIngredientList"

//Error Messsages
const ERROR_MESSAGE_AMOUNT_NAN = "Amount must be a number"
const ERROR_MESSAGE_AMOUNT_MISSING = "Amount required"
const ERROR_MESSAGE_NAME_MISSING = "Name required"
const ERROR_MESSAGE_INGREDIENT_LIST = "There is an error in one of the ingredients"

/*
*@prop ingredients
*@prop editable
*@prop handleAdd
*@prop handleEdit
*@prop handleRemove
*@prop dispatchErrors
*/
const IngredientList = (props) => {
  const ingredientErrors = useRef(new Map())

  const addBlankIngredient =  () => {
    props.handleAdd(new Ingredient())
  }

  let content = props.ingredients.map((ingr, index) => {
    return (
      <IngredientListItem
        key = {ingr.id}
        ingr = {ingr}
        pos = {index}
        editable = {props.editable}
        handleEdit = {props.handleEdit}
        handleRemove = {props.handleRemove}
        ref = {ingredientErrors}
        dispatchErrors = {props.dispatchErrors}
      />
    );
  });

  let buttons = null;
  if(props.editable){
   buttons = (
    <IconButton data-testid = {ID_BUTTON_ADD_INGREDIENT} onClick = {() => addBlankIngredient()}>
      <AddIcon />
    </IconButton>
   )
  }

  return (
    <div data-testid = "ingredientList">
      <List component = "ul">
        {content}
      </List>
      {buttons}
    </div>
  );

}

//ensures that if amountText is a valid number, then ingredient's amount is a number.
/*
*@prop ingr
*@prop editable
*@prop handleEdit
*@prop handleRemove
*@prop dispatchErrors
*@ref ingredientErrorsRef
*/
const IngredientListItem = React.forwardRef((props, ingredientErrorsRef) => {
  const [amountErrorMessage, setAmountErrorMessage] = useState(null)
  const [nameErrorMessage, setNameErrorMessage] = useState(null)

  useEffect(() => {
    if(props.editable){
      checkForErrors(props.ingr)
    }
  }, [props.ingr, props.editable])

  const checkForErrors = (ingr) => {
    let amount = Number(ingr.amount)
    let hasErrors = false;
    let amountErrorMessage = null;
    let nameErrorMessage = null;

    if(amount === 0){
      amountErrorMessage = ERROR_MESSAGE_AMOUNT_MISSING
      hasErrors = true;
    }
    else if(!Number.isFinite(amount)){
      amountErrorMessage = ERROR_MESSAGE_AMOUNT_NAN
      hasErrors = true;
    }

    if(!ingr.name){
      nameErrorMessage = ERROR_MESSAGE_NAME_MISSING
      hasErrors = true;
    }
    setAmountErrorMessage(amountErrorMessage)
    setNameErrorMessage(nameErrorMessage)
  
    if(hasErrors){
      if(ingredientErrorsRef.current.size == 0){
        //now there is a new error and this is the first error so notify that there is an error in ingredient list
        props.dispatchErrors({
          type: 'add', 
          errorKey: ERROR_KEY_INGREDIENT_LIST, 
          errorMessage: ERROR_MESSAGE_INGREDIENT_LIST
        })
      }
      ingredientErrorsRef.current.set(props.ingr.id, ERROR_MESSAGE_AMOUNT_MISSING)
    }
    else{
      //this is the last error and it will be removed, so there are now no errors. notify
      if(ingredientErrorsRef.current.size == 1){
        props.dispatchErrors({type: 'remove', errorKey: ERROR_KEY_INGREDIENT_LIST})
      }
      ingredientErrorsRef.current.delete(props.ingr.id)
    }    
  }

  const handleNameChange = (name) => {
    let editedIngredient = {...props.ingr}
    editedIngredient.name = name
    props.handleEdit(editedIngredient)
  }

  const handleAmountChange = (text) => {
    let amountText = text.trim()
    let amount = Number(amountText)
    let editedIngredient = {...props.ingr}
    editedIngredient.amount = amountText;

    if(amountText !== '' && Number.isFinite(amount)){
      editedIngredient.amount = amount
    }
    props.handleEdit(editedIngredient)
  }

  const handleUnitChange = (text) => {
    let unit = text.trim()
    let editedIngredient = {...props.ingr}
    editedIngredient.unit = unit
    props.handleEdit(editedIngredient)
  }
  
  if(props.editable){
    return (
      <ListItem data-testid = {props.ingr.id}>
        <TextField
          label = "Name"
          id = {"INGR_NAME_"+props.ingr.id}
          value = {props.ingr != null && props.ingr.name != null ? props.ingr.name : ''}
          onChange = {(event) => handleNameChange(event.target.value)}
          error = {nameErrorMessage != null}
          helperText = {nameErrorMessage}
          />
        <TextField 
          label = "Amount"
          id = {"INGR_AMOUNT_"+props.ingr.id}
          inputProps = {{ 'data-testid' :  ID_FIELD_INGREDIENT_AMOUNT }}
          value = {props.ingr != null && props.ingr.amount != null ? props.ingr.amount : ''}
          onChange = {(event) => handleAmountChange(event.target.value)}
          error = {amountErrorMessage != null}
          helperText = {amountErrorMessage}
        />
        <TextField 
          label = "Unit"
          id = {"INGR_UNIT_"+props.ingr.id}
          inputProps = {{'data-testid' : ID_FIELD_INGREDIENT_UNIT}}
          value = {props.ingr != null && props.ingr.unit != null ? props.ingr.unit : ''}
          onChange = {(event) => handleUnitChange(event.target.value)}
        />
        <IconButton size = "small" data-testid = {ID_DELETE_INGREDIENT_BUTTON} onClick = {() => props.handleRemove(props.ingr)}>
          <DeleteIcon />
        </IconButton>
      </ListItem>
    )
  }
  else{
    return (
      <ListItem>
        <ListItemText primary={`${props.ingr.name}, ${props.ingr.amount} ${props.ingr.unit ? props.ingr.unit: ""}`} />
      </ListItem>
    );
  }

});



export {
  IngredientList,
  ERROR_MESSAGE_AMOUNT_MISSING,
  ERROR_MESSAGE_NAME_MISSING,
  ERROR_MESSAGE_AMOUNT_NAN,
  ERROR_KEY_INGREDIENT_LIST,
  ID_DELETE_INGREDIENT_BUTTON,
  ID_FIELD_INGREDIENT_AMOUNT,
  ID_FIELD_INGREDIENT_UNIT,
  ID_FIELD_INGREDIENT_NAME,
  ID_BUTTON_ADD_INGREDIENT
};

