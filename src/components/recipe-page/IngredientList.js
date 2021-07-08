import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { useState } from 'react';
//import {UnitedValue, ERROR_TYPE_UNIT, ERROR_TYPE_VALUE} from './UnitedValue'
import { Ingredient } from '../../Model/ingredient';



//Non-unique testids
const ID_DELETE_INGREDIENT_BUTTON = "deleteIngredientButton"
const ID_FIELD_INGREDIENT_AMOUNT ="ingredientAmountField"
const ID_FIELD_INGREDIENT_NAME = "ingredientNameField"
const ID_FIELD_INGREDIENT_UNIT = "ingredientUnitField"

//Unique testIds

const ID_BUTTON_ADD_INGREDIENT = "startAddButton"

//Error Ids
const ERROR_ID_AMOUNT = "errorIdAmount"
const ERROR_ID_NAME = "errorIdName"

//Error Messsages
const ERROR_MESSAGE_AMOUNT_NAN = "Amount must be a number"
const ERROR_MESSAGE_AMOUNT_MISSING = "Amount required"
const ERROR_MESSAGE_NAME_MISSING = "Name required"

const IngredientList = ({ingredients, editable, handleAdd, handleEdit, handleRemove, dispatchErrors}) => {

  const addBlankIngredient =  () => {
    handleAdd(new Ingredient())
  }

  let content = ingredients.map((ingr, index) => {
    return (
      <IngredientListItem
        key = {ingr.id}
        ingr = {ingr}
        pos = {index}
        editable = {editable}
        handleEdit = {handleEdit}
        handleRemove = {handleRemove}
      />
    );
  });

  let buttons = null;
  if(editable){
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
const IngredientListItem = ({ingr, editable,  handleEdit, handleRemove}) => {
  const [amountErrorMessage, setAmountErrorMessage] = useState(null)
  const [nameErrorMessage, setNameErrorMessage] = useState(null)


  const checkForErrors = (ingr) => {
    let amount = Number(ingr.amount)
    if(amount === 0){
      setAmountErrorMessage(ERROR_MESSAGE_AMOUNT_MISSING)
    }
    else if(!Number.isFinite(amount)){
      setAmountErrorMessage(ERROR_MESSAGE_AMOUNT_NAN)
    }
    else{
      setAmountErrorMessage(null)
    }

    if(!ingr.name){
      setNameErrorMessage(ERROR_MESSAGE_NAME_MISSING)
    }
    else{
      setNameErrorMessage(null)
    }
  }

  const handleNameChange = (name) => {
    let editedIngredient = {...ingr}
    editedIngredient.name = name
    checkForErrors(editedIngredient)
    handleEdit(editedIngredient)
  }

  const handleAmountChange = (amountText) => {
    let amount = Number(amountText)
    let editedIngredient = {...ingr}
    editedIngredient.amount = amountText;

    if(amountText !== '' && Number.isFinite(amount)){
      editedIngredient.amount = amount
    }
    checkForErrors(editedIngredient)
    handleEdit(editedIngredient)
  }

  const handleUnitChange = (unit) => {
    let editedIngredient = {...ingr}
    editedIngredient.unit = unit
    checkForErrors(editedIngredient)
    handleEdit(editedIngredient)
  }
  
  if(editable){
    return (
      <ListItem data-testid = {ingr.id}>
        <TextField
          label = "Name"
          id = {"INGR_NAME_"+ingr.id}
          value = {ingr != null && ingr.name != null ? ingr.name : ''}
          onChange = {(event) => handleNameChange(event.target.value)}
          error = {nameErrorMessage != null}
          helperText = {nameErrorMessage}
          />
        <TextField 
          label = "Amount"
          id = {"INGR_AMOUNT_"+ingr.id}
          inputProps = {{ 'data-testid' :  ID_FIELD_INGREDIENT_AMOUNT }}
          value = {ingr != null && ingr.amount != null ? ingr.amount : ''}
          onChange = {(event) => handleAmountChange(event.target.value.trim())}
          error = {amountErrorMessage != null}
          helperText = {amountErrorMessage}
        />
        <TextField 
          label = "Unit"
          id = {"INGR_UNIT_"+ingr.id}
          inputProps = {{'data-testid' : ID_FIELD_INGREDIENT_UNIT}}
          value = {ingr != null && ingr.unit != null ? ingr.unit : ''}
          onChange = {(event) => handleUnitChange(event.target.value.trim())}
        />
        <IconButton size = "small" data-testid = {ID_DELETE_INGREDIENT_BUTTON} onClick = {() => handleRemove(ingr)}>
          <DeleteIcon />
        </IconButton>
      </ListItem>
    )
  }
  else{
    return (
      <ListItem>
        <ListItemText primary={`${ingr.name}, ${ingr.amount} ${ingr.unit ? ingr.unit: ""}`} />
      </ListItem>
    );
  }

}



export {
  IngredientList,
  ERROR_MESSAGE_AMOUNT_MISSING,
  ERROR_MESSAGE_NAME_MISSING,
  ERROR_MESSAGE_AMOUNT_NAN,
  ID_DELETE_INGREDIENT_BUTTON,
  ID_FIELD_INGREDIENT_AMOUNT,
  ID_FIELD_INGREDIENT_UNIT,
  ID_FIELD_INGREDIENT_NAME,
  ID_BUTTON_ADD_INGREDIENT
};

