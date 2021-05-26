import React, {useState} from 'react';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close'
import DeleteIcon from '@material-ui/icons/Delete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import Instruction from '../../Model/instruction'

const ERROR_BLANK_INSTRUCTION = "Enter an instruction"

const InstructionList = ({instructions, editable, handleAdd, handleRemove, handleEdit}) => {
  const [adding, setAdding] = useState(false)
  const [newInstructionText, setNewInstructionText] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const handleAddWrapper = function(newInstructionText){
    if(newInstructionText.trim() === ''){ 
      setErrorMessage(ERROR_BLANK_INSTRUCTION)
    }
    else{
      let newInstruction = new Instruction(newInstructionText)
      handleAdd(newInstruction)
      setNewInstructionText('')
      setErrorMessage(null)
    }
  }


  let content = null
  if(instructions != null){
    content = instructions.map((instr,index) => {
      return(
        <InstructionView
          key = {instr.id}
          instr = {instr} 
          pos = {index}
          handleRemove = {handleRemove}
          editable = {editable}
          handleEdit = {handleEdit}
        />            
      ) 
    });
  }

  let buttons = null;
  if(adding && editable){
    buttons = (
      <React.Fragment>
        <TextField
          inputProps = {{ "data-testid" : "newInstructionField" }}
          value = {newInstructionText}
          error = {errorMessage != null}
          helperText = {errorMessage}
          onChange = {(event) => setNewInstructionText(event.target.value)}
        />
        <Button onClick = {() => handleAddWrapper(newInstructionText)}>
          Add instruction
        </Button>
        <IconButton onClick = {() => setAdding(false)}>
          <CloseIcon />
        </IconButton>
      </React.Fragment>
    )
  }
  else if(editable){
    buttons = (
      <IconButton onClick = {() => setAdding(true)} data-testid = "addingInstructionButton">
        <AddIcon />
      </IconButton>
    )
  }


  return (
      <div data-testid = "instructionList">
        <List component = "ol">
          {content}
        </List>
        {buttons}
      </div>

      

  );
}

const InstructionView = ({instr, pos, editable, handleEdit, handleRemove}) => {
  const [instrText, setInstrText] = useState(instr != null ? instr.text : '')
  const handleEditWrapper = (newText) => {
    setInstrText(newText)
    handleEdit(pos, newText)
  }

  if(editable){
    return (
      <ListItem component="li">
        <ListItemText primary={`${1 + pos}.`}/>
        <TextField 
          value = {instrText}
          onChange = {(event) => handleEditWrapper(event.target.value)}
        />
        <IconButton size = "small" onClick = {() => handleRemove(pos)}>
          <DeleteIcon />
        </IconButton>
      </ListItem>
    )
  }
  else{
    return (
        <ListItem component="li">
          <ListItemText primary={`${1 + pos}. ${instrText}`}/>
        </ListItem>
    )
  }
}

export {InstructionList, ERROR_BLANK_INSTRUCTION };