import React, {useState} from 'react';

import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close'
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';

//import {UnitedValue, ERROR_TYPE_UNIT, ERROR_TYPE_VALUE} from './UnitedValue'
import {Ingredient} from '../../Model/ingredient'

const ID_DELETE_INGREDIENT_BUTTON = "deleteIngredientButton"

//Error Ids
const ERROR_ID_AMOUNT = "errorIdAmount"
const ERROR_ID_NAME = "errorIdName"

//Error Messsages
const ERROR_MESSAGE_AMOUNT_NAN = "Amount must be a number"
const ERROR_MESSAGE_AMOUNT_MISSING = "Amount required"
const ERROR_MESSAGE_NAME_MISSING = "Name required"

const IngredientList = ({ingredients, editable, handleAdd, handleEdit, handleRemove, dispatchErrors}) => {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newAmount, setNewAmount] = useState(1)
  const [newUnit, setNewUnit] = useState('')
  const [amountErrorMessage, setAmountErrorMessage] = useState(null)
  const [nameErrorMessage, setNameErrorMessage] = useState(null)


  const addIngredient =  () => {
    let amount = Number(newAmount)
    let hasError = false;
    if(amount === 0 || !Number.isFinite(amount)){
      setAmountErrorMessage(ERROR_MESSAGE_AMOUNT_MISSING)
      hasError = true;
    }
    else{
      setAmountErrorMessage(null)
    }

    if(newName.trim() === ''){
      setNameErrorMessage(ERROR_MESSAGE_NAME_MISSING)
      hasError = true;
    }
    else{
      setNameErrorMessage(null)
    }

    if(!hasError){
      let newIngredient = new Ingredient(newName, amount, newUnit, null)
      handleAdd(newIngredient)
      setNewName('')
      setNewAmount(1)
      setNewUnit('')
    }
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
  if(adding && editable){
    buttons = (
      <React.Fragment>
        <TextField 
          inputProps = {{ 'data-testid' : 'newNameField' }}
          label = "Name"
          value = {newName}
          error = {nameErrorMessage != null}
          helperText = {nameErrorMessage}
          onChange = {(event) => setNewName(event.target.value)} />
        <TextField
          inputProps = {{ 'data-testid' : 'newAmountField' }} 
          label = "Amount"
          value = {newAmount}
          error = {amountErrorMessage != null}
          helperText = {amountErrorMessage}
          onChange = {(event) => setNewAmount(event.target.value)}/>
        <TextField 
          inputProps = {{ 'data-testid' : 'newUnitField' }}
          label = "Unit"
          value = {newUnit}
          onChange = {(event) => setNewUnit(event.target.value)}/>
        <Button onClick = {addIngredient} disabled = {amountErrorMessage != null || nameErrorMessage != null}>
          Add ingredient
        </Button>
        <IconButton onClick = {() => setAdding(false)}>
          <CloseIcon />
        </IconButton>
      </React.Fragment>
    )
  }
  else if(editable){
   buttons = (
    <IconButton data-testid = "startAddButton" onClick = {() => setAdding(true)}>
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

const IngredientListItem = ({ingr, pos, editable, handleEdit, handleRemove}) => {
  const [amountErrorMessage, setAmountErrorMessage] = useState(null)


  const handleNameChange = (name) => {
    let editedIngredient = {...ingr}
    editedIngredient.name = name
    handleEdit(editedIngredient)
  }

  const handleAmountChange = (amountText) => {
    let amount = Number(amountText)
    if(amountText !== '' && Number.isFinite(amount)){
      let editedIngredient = {...ingr}
      editedIngredient.amount = amount;
      handleEdit(editedIngredient)
      setAmountErrorMessage(null)
    }
    else if(amountText === ''){
      setAmountErrorMessage(ERROR_MESSAGE_AMOUNT_MISSING)
    }
    else{
      setAmountErrorMessage(ERROR_MESSAGE_AMOUNT_NAN)
    }

  }

  const handleUnitChange = (unit) => {
    let editedIngredient = {...ingr}
    editedIngredient.unit = unit
    handleEdit(editedIngredient)
  }
  
  if(editable){
    return (
      <ListItem data-testid = {ingr.id}>
        <TextField 
          label = "Name"
          value = {ingr != null && ingr.name != null ? ingr.name : ''}
          onChange = {(event) => handleNameChange(event.target.value.trim())}
          />
        <TextField 
          label = "Amount"
          value = {ingr != null && ingr.amount != null ? ingr.amount : ''}
          onChange = {(event) => handleAmountChange(event.target.value.trim())}
        />
        <TextField 
          label = "Unit"
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
  ID_DELETE_INGREDIENT_BUTTON
};
