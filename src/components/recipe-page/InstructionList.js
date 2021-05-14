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

const InstructionList = ({instructions, editable, handleAdd, handleRemove, handleEdit}) => {
  const [adding, setAdding] = useState(false)
  const [newInstruction, setNewInstruction] = useState('')

  const handleAddWrapper = function(newInstruction){
    handleAdd(newInstruction)
    setNewInstruction('')
  }


  let content = null
  if(instructions != null){
    content = instructions.map((value,index) => {
      return(
        <Instruction
          key = {value}
          instr = {value} 
          pos = {index}
          deleteHandler = {handleRemove}
          editable = {editable}
          editInstruction = {handleEdit}
        />            
      ) 
    });
  }

  let buttons = null;
  if(adding && editable){
    buttons = (
      <React.Fragment>
        <TextField
          name = "newInstructionField"
          value = {newInstruction}
          onChange = {(event) => setNewInstruction(event.target.value)}
        />
        <Button onClick = {() => handleAddWrapper(newInstruction)}>
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

const Instruction = ({instr, pos, editable, handleEdit, handleRemove}) => {
  const [instrText, setInstrText] = useState(instr != null ? instr : '')
  const handleEditWrapper = (newText) => {
    setInstrText(newText)
    handleEdit(pos, newText)
  }

  if(editable){
    return (
      <ListItem key = {pos} component="li">
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
        <ListItem key = {pos} component="li">
          <ListItemText primary={`${1 + pos}. ${instrText}`}/>
        </ListItem>
    )
  }
}

export {InstructionList };