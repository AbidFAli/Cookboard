import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { useState } from 'react';
import Instruction from '../../Model/instruction';


const ERROR_BLANK_INSTRUCTION = "Enter an instruction"

//ids
const ID_FIELD_NEW_INSTRUCTION = "newInstructionField"
const ID_BUTTON_ADD_INSTRUCTION = "addingInstructionButton"
const ID_INSTRUCTION_LIST = "idInstructionList"

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
  if(instructions){
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
          inputProps = {{ "data-testid" : ID_FIELD_NEW_INSTRUCTION }}
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
      <IconButton onClick = {() => setAdding(true)} data-testid = {ID_BUTTON_ADD_INSTRUCTION}>
        <AddIcon />
      </IconButton>
    )
  }


  return (
      <div data-testid = {ID_INSTRUCTION_LIST}>
        <List component = "ol">
          {content}
        </List>
        {buttons}
      </div>

      

  );
}

const InstructionView = ({instr, pos, editable, handleEdit, handleRemove}) => {
  const [instrText, setInstrText] = useState(instr != null ? instr.text : '')
  const [errorMessage, setErrorMessage] = useState(null)

  const handleEditWrapper = (newText) => {
    setInstrText(newText)
    handleEdit(pos, newText)
    setErrorMessage(newText.trim() !== '' ? null : ERROR_BLANK_INSTRUCTION)
  }

  if(editable){
    return (
      <ListItem component="li">
        <ListItemText primary={`${1 + pos}.`}/>
        <TextField 
          value = {instrText}
          onChange = {(event) => handleEditWrapper(event.target.value)}
          error = {errorMessage != null}
          helperText = {errorMessage}
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

export {
  InstructionList,
  ERROR_BLANK_INSTRUCTION,
  ID_BUTTON_ADD_INSTRUCTION,
  ID_FIELD_NEW_INSTRUCTION,
  ID_INSTRUCTION_LIST
};

