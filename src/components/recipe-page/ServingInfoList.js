import React, {useState, useEffect, useRef } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import RecipeErrorService from '../../services/recipeErrorService'

//Error Types
const ERROR_NUM_SERVED = "errorKeyNumServed"
const ERROR_YIELD = "errorKeyYield"
const ERROR_SERVING_SIZE = "errorKeyServingSize"

//Error Messages
const ERROR_MSG_NUM_SERVED_NAN = "No. Served must be a number"
const ERROR_MSG_YIELD_NAN = "Yield must be a number"
const ERROR_MSG_SERVING_SIZE_NAN = "Serving Size must be a number"


const FIELD_NUM_SERVED = "fieldNumServed"
const FIELD_YIELD = "fieldYield"
const FIELD_SERVING_SIZE = "fieldServingSize"

const ServingInfoList = ({servingInfo, setServingInfo, editable, updateHasErrors}) => {
  const errorService = useRef(new RecipeErrorService())
  const [numServedErrorMessage, setNumServedErrorMessage] = useState(null)
  const [yieldErrorMessage, setYieldErrorMessage] = useState(null)
  const [servingSizeErrorMessage, setServingSizeErrorMessage] = useState(null)

  // useEffect(()=> {

  //   const updateErrors = (errorMessageVariable) => {
  //     if(errorMessageVariable == null){

  //     }
  //   }

  // }, [servingSizeErrorMessage, yieldErrorMessage, numServedErrorMessage])

  const handleChangeNumServed = (numServedText) => {
    let numServed = Number(numServedText)
    if(Number.isFinite(numServed) && numServedText.trim() !== ''){
      let newServingInfo = {...servingInfo}
      newServingInfo.numServed = numServed
      setServingInfo(newServingInfo)
      setNumServedErrorMessage(null)
      errorService.current.removeError(ERROR_NUM_SERVED)
    }
    else if(!Number.isFinite(numServed)){
      setNumServedErrorMessage(ERROR_MSG_NUM_SERVED_NAN)
      errorService.current.addError(ERROR_NUM_SERVED)
    }


  }
  const handleChangeYield = (servingYieldText) => {
    let servingYield = Number(servingYieldText)
    if(Number.isFinite(servingYield) && servingYieldText.trim() !== ''){
      let newServingInfo = {...servingInfo}
      newServingInfo.yield = servingYield
      setServingInfo(newServingInfo)
      setYieldErrorMessage(null)
      errorService.current.removeError(ERROR_YIELD)
    } 
    else if(!Number.isFinite(servingYield)){
      setYieldErrorMessage(ERROR_MSG_YIELD_NAN)
      errorService.current.addError(ERROR_YIELD)
    }

  }
  const handleChangeServingSize = (servingSizeText) => {
    let servingSize = Number(servingSizeText)
    if(Number.isFinite(servingSize) && servingSizeText.trim() !== ''){
      let newServingInfo = {...servingInfo}
      newServingInfo.servingSize = servingSize
      setServingInfo(newServingInfo)
      setServingSizeErrorMessage(null)
      errorService.current.removeError(ERROR_SERVING_SIZE)
    }
    else if(!Number.isFinite(servingSize)){
      setServingSizeErrorMessage(ERROR_MSG_SERVING_SIZE_NAN)
      errorService.current.addError(ERROR_SERVING_SIZE)
    }
  }

  const handleChangeServingSizeUnit = (unit) => {
    let newServingInfo = {...servingInfo}
    newServingInfo.unit = unit.trim() !== '' ? unit : undefined
    setServingInfo(newServingInfo)
  }

  let content;
  if(editable){
    content = (
      <List component = "ul">
        <ListItem>
          <TextField
            name = {FIELD_NUM_SERVED}
            inputProps = {{'data-testid': FIELD_NUM_SERVED}}
            defaultValue= {servingInfo != null && servingInfo.numServed != null ? servingInfo.numServed : ''}
            error = {numServedErrorMessage != null}
            helperText = {numServedErrorMessage}
            label = "Number Served"
            onChange = {(event) => handleChangeNumServed(event.target.value)}
          />
        </ListItem>
        <ListItem>
          <TextField
            name = {FIELD_YIELD}
            inputProps = {{'data-testid': FIELD_YIELD}}
            defaultValue= {servingInfo != null && servingInfo.yield != null ? servingInfo.yield : ''}
            error = {yieldErrorMessage != null}
            helperText = {yieldErrorMessage}
            label = "Yield"
            onChange = {(event) => handleChangeYield(event.target.value)}
            />
        </ListItem>
        <ListItem>
          <TextField
            name = {FIELD_SERVING_SIZE}
            inputProps = {{'data-testid' : FIELD_SERVING_SIZE}}
            defaultValue= {servingInfo != null && servingInfo.servingSize != null ? servingInfo.servingSize : ''}
            error = {servingSizeErrorMessage != null}
            helperText = {servingSizeErrorMessage}
            label = "Serving Size"
            onChange = {(event) => handleChangeServingSize(event.target.value)}
            />
          <TextField
            name = "fieldServingSizeUnit"
            defaultValue= {servingInfo != null && servingInfo.unit != null  ? servingInfo.unit : ''}
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
          <ListItemText primary={`Serving size: ${servingInfo.servingSize} ${servingInfo.unit ? servingInfo.unit : ''}`} />
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

export {
  ServingInfoList,  
  ERROR_MSG_NUM_SERVED_NAN,  
  ERROR_MSG_SERVING_SIZE_NAN, 
  ERROR_MSG_YIELD_NAN,
  FIELD_NUM_SERVED,
  FIELD_SERVING_SIZE,
  FIELD_YIELD
}