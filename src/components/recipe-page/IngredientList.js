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


const IngredientList = ({ingredients, editable, handleAdd, handleEdit, handleRemove}) => {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newAmount, setNewAmount] = useState(0)
  const [newUnit, setNewUnit] = useState('')

  const addIngredient = () => {
    handleAdd({name : newName, amount: newAmount, unit: newUnit});
    setNewName('')
    setNewAmount(0)
    setNewUnit('')
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
          onChange = {(event) => setNewName(event.target.value)} />
        <TextField
          inputProps = {{ 'data-testid' : 'newAmountField' }} 
          label = "Amount"
          value = {newAmount}
          onChange = {(event) => setNewAmount(event.target.value)}/>
        <TextField 
          inputProps = {{ 'data-testid' : 'newUnitField' }}
          label = "Unit"
          value = {newUnit}
          onChange = {(event) => setNewUnit(event.target.value)}/>
        <Button onClick = {addIngredient}>
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
    <React.Fragment>
      <List component = "ul">
        {content}
      </List>
      {buttons}
    </React.Fragment>

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



export {IngredientList};