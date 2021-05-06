import React, {useState} from 'react';
import { Recipe } from '../Model/recipe.js';

import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Paper';
import CancelIcon from '@material-ui/icons/Cancel'
import CloseIcon from '@material-ui/icons/Close'
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Fab from '@material-ui/core/Fab'
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Rating from '@material-ui/lab/Rating';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import backImg from './../img/icons8-go-back-48.png';

/*
 *@prop recipe: the Recipe object containing info about the recipe to display.
 */
const RecipePage = ({recipe}) => {
    //recipe state
    const [name, setName] = useState(recipe.name != null ? recipe.name : '')
    const [description, setDescription] = useState(recipe.desc != null ? recipe.desc : '')
    const [instructions, setInstructions] = useState(recipe.instructions != null ? recipe.instructions : [])
    const [ingredients, setIngredients] = useState(recipe.ingredients != null ? recipe.ingredients : [])
    const [rating, setRating] = useState(recipe.stars != null ? recipe.stars : 0)
    const [timeToMake, setTimeToMake] = useState(recipe.timeToMake != null ? recipe.timeToMake : null)
    const [servingInfo, setServingInfo] = useState(recipe.servingInfo != null ? recipe.servingInfo : null)
    
    const [editable, setEditable] = useState(false)
    const [created, setCreated] = useState(false)
    
    const handleSave = () => {
      setEditable(false);
      //TODO fill in 
    }

    return (
      <Grid container spacing={4}>
          <Grid container item xs={12} spacing={3} justify='space-between' alignItems='flex-end'>
              <Grid item>
                  <RecipeName recipeName = {name} setRecipeName = {setName} editable = {editable} />
              </Grid>
              <Grid item >
                  <TimingInfo timeToMake = {timeToMake} setTimeToMake = {setTimeToMake} editable = {editable} />
              </Grid>
          </Grid>
          <Grid item xs={12}>
              <Paper>
                  <DescriptionRating 
                      desc={description} 
                      setDesc = {setDescription}
                      rating={rating}
                      setRating = {setRating} 
                      editable = {editable}/>
              </Paper>
          </Grid>
          <Grid item  xs={12}>
              <Paper>
                  <Typography variant="h5" gutterBottom>
                      Ingredients
                  </Typography>
                  <IngredientList ingredients={ingredients} editable = {editable} />
              </Paper>
          </Grid>
          <Grid item  xs={12} >                    
              <ServingInfoList servingInfo = {servingInfo} setServingInfo = {setServingInfo} editable = {editable} />
          </Grid>
          <Grid item xs={12} >
              <Paper>
                  <Typography variant="h5" gutterBottom>
                      Instructions
                  </Typography>
                  <InstructionList instructions={instructions} setInstructions = {setInstructions} editable = {editable} />
              </Paper>
          </Grid>
          <Grid item xs = {12} >
            {editable 
              ? <Button variant = "outlined" color = "primary" onClick = {() => handleSave()}>Save Changes</Button>
              : null
            }
            <Fab name = "editButton" color = {editable === false ? "primary" : "secondary" } onClick = {() => setEditable(!editable)}>
              {
                editable
                ? <CancelIcon/>
                : <EditIcon/>
              }
            </Fab>
          </Grid>
      </Grid>
    );
    
}

const RecipeName = ({recipeName, setRecipeName, editable}) => {
    const handleChangeRecipeName = (newName) => {
        setRecipeName(newName)
    }

    if(editable){
        return (
            <TextField
                name = "fieldRecipeName"
                defaultValue= {recipeName != null ? recipeName : ''}
                label = "Recipe Name"
                onChange = {(event) => handleChangeRecipeName(event.target.value)}
            />
        )
    }
    else{
        return (
            <Typography variant="h2">
                {recipeName}
            </Typography>
        )
    }
}

const TimingInfo = ({timeToMake, setTimeToMake, editable}) => {
    const handleChangeTTMValue = (newValue) => {
        let newTimeToMake = {...timeToMake}
        newTimeToMake.value = newValue
        setTimeToMake(newTimeToMake)
    }

    const handleChangeTTMUnit = (newUnit) => {
        let newTimeToMake = {...timeToMake}
        newTimeToMake.unit = newUnit
        setTimeToMake(newTimeToMake)
    }
    //<Grid container item xs={12} spacing={3} justify='space-between' alignItems='flex-end'>
    if(editable){
        return(
            <React.Fragment>
                <TextField
                    name = "fieldTimeToMakeValue"
                    defaultValue= {timeToMake != null ? timeToMake.value : ''}
                    label = "Prep Time(value)"
                    onChange = {(event) => handleChangeTTMValue(event.target.value)}
                />
                <TextField
                    name = "fieldTimeToMakeUnit"
                    defaultValue= {timeToMake != null ? timeToMake.unit : ''}
                    label = "Prep Time(unit)"
                    onChange = {(event) => handleChangeTTMUnit(event.target.value)}
                />
            </React.Fragment>


        )
    }
    else{
        return(
            <Typography variant="h4">
                {timeToMake != null ? timeToMake.value + ' ' + timeToMake.unit : ''}
            </Typography>
        )
    }
}
const ServingInfoList = ({servingInfo, setServingInfo, editable}) => {

    const handleChangeNumServed = (numServed) => {
      let newServingInfo = {...servingInfo}
      newServingInfo.numServed = numServed
      setServingInfo(newServingInfo)
    }
    const handleChangeYield = (servingYield) => {
      let newServingInfo = {...servingInfo}
      newServingInfo.yield = servingYield
      setServingInfo(newServingInfo)
    }
    const handleChangeServingSize = (servingSize) => {
      let newServingInfo = {...servingInfo}
      newServingInfo.servingSize = servingSize
      setServingInfo(newServingInfo)
    }
    const handleChangeServingSizeUnit = (unit) => {
      let newServingInfo = {...servingInfo}
      newServingInfo.unit = unit
      setServingInfo(newServingInfo)
    }

    let content;
    if(editable){
      content = (
        <List component = "ul">
          <ListItem>
            <TextField
              name = "fieldNumServed"
              defaultValue= {servingInfo != null ? servingInfo.numServed : ''}
              label = "Number Served"
              onChange = {(event) => handleChangeNumServed(event.target.value)}
            />
          </ListItem>
          <ListItem>
            <TextField
              name = "fieldYield"
              defaultValue= {servingInfo != null ? servingInfo.yield : ''}
              label = "Yield"
              onChange = {(event) => handleChangeYield(event.target.value)}
              />
          </ListItem>
          <ListItem>
            <TextField
              name = "fieldServingSize"
              defaultValue= {servingInfo != null ? servingInfo.servingSize : ''}
              label = "Serving Size"
              onChange = {(event) => handleChangeServingSize(event.target.value)}
              />
            <TextField
              name = "fieldServingSizeUnit"
              defaultValue= {servingInfo != null ? servingInfo.unit : ''}
              label = "Unit"
              onChange = {(event) => handleChangeServingSizeUnit(event.target.value)}
              />
          </ListItem>
        </List>
      )
    }
    else if(!editable && servingInfo != null){
      content = (
        <List component = "ul">
        <ListItem>
            <ListItemText primary={`Serves: ${servingInfo.numServed}`} />
        </ListItem>
        <ListItem>
            <ListItemText primary={`Yield: ${servingInfo.yield} servings`} />
        </ListItem>
        <ListItem>
            <ListItemText primary={`Serving size: ${servingInfo.servingSize} ${servingInfo.unit}`} />
        </ListItem>
        </List>
      );
    }
    return(
        <Paper>
            <Typography variant="h5" gutterBottom>
                Serving Info
            </Typography>
            {content}
        </Paper>
    );
    

}



/*
 *@param props = {
 *  desc: recipe description; string
 *  stars: number of recipe stars; number
 * } 
 */
const DescriptionRating = ({editable, desc, setDesc, rating, setRating}) => {
    const handleChangeDesc = (newDesc) => {
        setDesc(newDesc)
        console.log('New description is' + newDesc)
    }
    let viewDescription;
    if(editable){
        viewDescription = (
            <TextField
                name = "fieldDescription"
                label = "Description"
                defaultValue= {desc} 
                onChange = {(event) => handleChangeDesc(event.target.value)}/>
        )
    }
    else{
        viewDescription = (
            <Typography variant = "body1">
                {desc}
            </Typography>
        )
    }

    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography variant="h5" gutterBottom>
                    Description
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="h5" gutterBottom>
                    Rating
                </Typography>
            </Grid>
            <Grid item xs={6}>
                {viewDescription}
            </Grid>
            <Grid item xs={6}>
                <Rating 
                  name = "rating" 
                  value = {rating}
                  readOnly = {!editable}
                  preciscion = {0.5}
                  onChange = {(event, newRating) => setRating(newRating) }
                />
            </Grid>
        </Grid>


    )

}

// const CrudList = ({list, setList, editable, numbered, defaultElementValue}) => {
//   const [adding, setAdding] = useState(false)
//   const [newValue, setNewValue] = useState(defaultElementValue)

//   const addElement = function(element){
//     let newList = Array.from(elements)
//     newList.push(element)
//     setNewValue(defaultElementValue)
//     setInstructions(newInstructions)
//   }

//   const removeElement = function(index){
//     let newInstructions = Array.from(instructions)
//     newInstructions.splice(index,1)
//     setInstructions(newInstructions)
//   }

//   const editElement = function(index, newInstruction){
//     let newInstructions = Array.from(instructions)
//     newInstructions[index] = newInstruction
//     setInstructions(newInstructions)
//   }
// }

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
    let buttons;
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
    else{
      buttons = null;
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
        <ListItem component="li">
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
          <ListItem component="li">
            <ListItemText primary={`${1 + pos}. ${instrText}`}/>
          </ListItem>
      )
    }
}

const IngredientList = ({ingredients, editable}) => {

    
  let content = ingredients.map((ingr, index) => {
      return (<Ingredient ingr = {ingr} editable = {editable}/>);
  });
  return (
          <List component = "ul">
          {content}
          </List>
          
  );

}

const Ingredient = ({ingr, editable}) => {
  const [name, setName] = useState(ingr != null ? ingr.name : '')
  const [amount, setAmount] = useState(ingr != null ? ingr.amount : '')
  const [unit, setUnit] = useState(ingr != null ? ingr.unit : '')

  //const handle

  if(editable){
    return (
      <ListItem key={ingr.name}>
        <TextField 
          label = "Name"
          value = {name}
          />
        <TextField 
          label = "Amount"
          value = {amount}
        />
        <TextField 
          label = "Unit"
          value = {unit}
        />
      </ListItem>
    )
  }
  else{
    return (
      <ListItem key={ingr.name}>
        <ListItemText primary={`${ingr.name}, ${ingr.amount} ${ingr.unit}`} />
      </ListItem>
    );
  }

}



export { RecipePage, InstructionList, IngredientList };