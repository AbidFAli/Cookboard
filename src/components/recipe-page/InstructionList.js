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

const InstructionList = ({instructions, setInstructions, editable}) => {
  const [adding, setAdding] = useState(false)
  const [newInstruction, setNewInstruction] = useState('')

  const addInstruction = function(newInstruction){
    let newInstructions = Array.from(instructions)
    newInstructions.push(newInstruction)
    setNewInstruction('')
    setInstructions(newInstructions)
  }

  const removeInstruction = function(index){
    let newInstructions = Array.from(instructions)
    newInstructions.splice(index,1)
    setInstructions(newInstructions)
  }

  const editInstruction = function(index, newInstruction){
    let newInstructions = Array.from(instructions)
    newInstructions[index] = newInstruction
    setInstructions(newInstructions)
  }
  
  let content = instructions.map((value,index) => {
      return(
          <Instruction 
            instr = {value} 
            pos = {index}
            deleteHandler = {removeInstruction}
            editable = {editable}
            editInstruction = {editInstruction}
          />            
      ) 
        
  });
  let buttons = null;
  if(adding && editable){
    buttons = (
      <React.Fragment>
        <TextField
          name = "newInstructionField"
          value = {newInstruction}
          onChange = {(event) => setNewInstruction(event.target.value)}
        />
        <Button onClick = {() => addInstruction(newInstruction)}>
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
      <IconButton onClick = {() => setAdding(true)}>
        <AddIcon />
      </IconButton>
    )
  }


  return (
      <React.Fragment>
          <List component = "ol">
              {content}
          </List>
          {buttons}
      </React.Fragment>

  );
}

const Instruction = ({instr, pos, deleteHandler, editable, editInstruction}) => {
  const [instrText, setInstrText] = useState(instr != null ? instr : '')
  const handleEdits = (newText) => {
    setInstrText(newText)
    editInstruction(pos, newText)
  }

  if(editable){
    return (
      <ListItem key = {pos} component="li">
        <ListItemText primary={`${1 + pos}.`}/>
        <TextField 
          value = {instrText}
          onChange = {(event) => handleEdits(event.target.value)}
        />
        <IconButton size = "small" onClick = {() => deleteHandler(pos)}>
          <DeleteIcon />
        </IconButton>
      </ListItem>
    )
  }
  else{
    return (
        <ListItem key = {pos} component="li">
          <ListItemText primary={`${1 + pos}. ${instrText}`}/>
        </ListItem>
    )
  }
}

export {InstructionList };