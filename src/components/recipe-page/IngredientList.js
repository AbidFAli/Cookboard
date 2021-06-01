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

import {UnitedValue, ERROR_TYPE_UNIT, ERROR_TYPE_VALUE} from './UnitedValue'

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

  const handleErrors = () => {
    
  }

  const addIngredient = () => {
    let amount = Number(newAmount)
    let hasError = false;
    if(amount == 0 || !Number.isFinite(amount)){
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
      handleAdd({
        name : newName, 
        amount: amount, 
        unit: newUnit.trim() === '' ? undefined : newUnit
      });
      setNewName('')
      setNewAmount(1)
      setNewUnit('')
    }
  }

  let content = ingredients.map((ingr, index) => {
    return (
      <Ingredient
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

const Ingredient = ({ingr, pos, editable, handleEdit, handleRemove}) => {
  const [name, setName] = useState(ingr != null ? ingr.name : '');
  const [amount, setAmount] = useState(ingr != null ? ingr.amount : '');
  const [unit, setUnit] = useState(ingr != null ? ingr.unit : '');

  const handleNameChange = (name) => {
    setName(name)
    let editedIngredient = {...ingr}
    editedIngredient.name = name
    handleEdit(editedIngredient)
  }

  const handleAmountChange = (amount) => {
    setAmount(amount)
    let editedIngredient = {...ingr}
    editedIngredient.amount = amount
    handleEdit(editedIngredient)
  }

  const handleUnitChange = (unit) => {
    setUnit(unit)
    let editedIngredient = {...ingr}
    editedIngredient.unit = unit
    handleEdit(editedIngredient)
  }
  
  if(editable){
    return (
      <ListItem data-testid = {ingr.id}>
        <TextField 
          label = "Name"
          value = {name}
          onChange = {(event) => handleNameChange(event.target.value)}
          />
        <TextField 
          label = "Amount"
          value = {amount}
          onChange = {(event) => handleAmountChange(event.target.value)}
        />
        <TextField 
          label = "Unit"
          value = {unit}
          onChange = {(event) => handleUnitChange(event.target.value)}
        />
        <IconButton size = "small" data-testid = "deleteIngredientButton" onClick = {() => handleRemove(ingr)}>
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
  ERROR_MESSAGE_AMOUNT_NAN
};