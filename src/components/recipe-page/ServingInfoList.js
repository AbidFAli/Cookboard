import React, {useState, useEffect, useRef } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import {UnitedValue, ERROR_TYPE_UNIT, ERROR_TYPE_VALUE} from './UnitedValue'


//Error Ids
const ERROR_NUM_SERVED = "errorKeyNumServed"
const ERROR_YIELD = "errorKeyYield"
const ERROR_SERVING_SIZE = "errorKeyServingSize"
const ERROR_SERVING_SIZE_UNIT = "errorKeyServingSizeUnit"

//Error Messages
const ERROR_MSG_NUM_SERVED_NAN = "No. Served must be a number"
const ERROR_MSG_YIELD_NAN = "Yield must be a number"
const ERROR_MSG_SERVING_SIZE_NAN = "Serving Size must be a number"
const ERROR_MSG_SERVING_SIZE_MISSING = "Serving Size missing"
const ERROR_MSG_SERVING_SIZE_UNIT_MISSING = "Unit missing"


const FIELD_NUM_SERVED = "fieldNumServed"
const FIELD_YIELD = "fieldYield"
const FIELD_SERVING_SIZE = "fieldServingSize"
const FIELD_SERVING_SIZE_UNIT = "fieldServingSizeUnit"


const ServingInfoList = ({servingInfo, setServingInfo, editable, errors, dispatchErrors}) => {


  const handleChangeNumServed = (numServedText) => {
    let numServed = Number(numServedText)
    let newServingInfo = {...servingInfo}

    if(numServedText.trim() == ''){
      newServingInfo.numServed = undefined
      setServingInfo(newServingInfo)
      dispatchErrors({type: 'remove', errorKey: ERROR_NUM_SERVED})
    }
    else if(Number.isFinite(numServed)){
      newServingInfo.numServed = numServed
      setServingInfo(newServingInfo)
      dispatchErrors({type: 'remove', errorKey: ERROR_NUM_SERVED})
    }
    else if(!Number.isFinite(numServed)){
      dispatchErrors({type: 'add', errorKey: ERROR_NUM_SERVED, errorMessage: ERROR_MSG_NUM_SERVED_NAN })
    }


  }
  const handleChangeYield = (servingYieldText) => {
    let servingYield = Number(servingYieldText)
    let newServingInfo = {...servingInfo}

    if(servingYieldText.trim() == ''){
      newServingInfo.yield = undefined
      dispatchErrors({type: 'remove', errorKey: ERROR_YIELD})
    }
    else if(Number.isFinite(servingYield) ){
      newServingInfo.yield = servingYield
      setServingInfo(newServingInfo)
      dispatchErrors({type: 'remove', errorKey: ERROR_YIELD})
    } 
    else if(!Number.isFinite(servingYield)){
      dispatchErrors({type: 'add', errorKey: ERROR_YIELD, errorMessage: ERROR_MSG_YIELD_NAN })
    }

  }

  const updateServingSize = (servingSize) => {
    let newServingInfo = {...servingInfo}
    newServingInfo.servingSize = servingSize
    setServingInfo(newServingInfo)
  }

  const updateServingSizeUnit = (servingSizeUnit) => {
    let newServingInfo = {...servingInfo}
    newServingInfo.unit = servingSizeUnit
    setServingInfo(newServingInfo)
  }

  const handleServingSizeErrors = (servingSize, servingSizeUnit) => {
    dispatchErrors({type: 'remove', errorKey: ERROR_SERVING_SIZE})
    dispatchErrors({type: 'remove', errorKey: ERROR_SERVING_SIZE_UNIT})
    let errorKey = null, errorMessage = null, errorType = null;

    if(servingSize != undefined  && !Number.isFinite(servingSize)){
      errorKey = ERROR_SERVING_SIZE
      errorMessage = ERROR_MSG_SERVING_SIZE_NAN
      errorType = ERROR_TYPE_VALUE
    }
    else if(servingSize != undefined && servingSizeUnit == undefined){
      errorKey = ERROR_SERVING_SIZE_UNIT
      errorMessage = ERROR_MSG_SERVING_SIZE_UNIT_MISSING
      errorType = ERROR_TYPE_UNIT
    }
    else if(servingSize == undefined && servingSizeUnit != undefined){
      errorKey = ERROR_SERVING_SIZE
      errorMessage = ERROR_MSG_SERVING_SIZE_MISSING
      errorType = ERROR_TYPE_VALUE
    }

    if(errorKey != null){
      dispatchErrors({type : 'add', errorKey : errorKey, errorMessage : errorMessage})
    }

    return [errorType, errorMessage]
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
            error = {errors.hasError(ERROR_NUM_SERVED)}
            helperText = {errors.getErrorMessage(ERROR_NUM_SERVED)}
            label = "Number Served"
            onChange = {(event) => handleChangeNumServed(event.target.value)}
          />
        </ListItem>
        <ListItem>
          <TextField
            name = {FIELD_YIELD}
            inputProps = {{'data-testid': FIELD_YIELD}}
            defaultValue= {servingInfo != null && servingInfo.yield != null ? servingInfo.yield : ''}
            error = {errors.hasError(ERROR_YIELD)}
            helperText = {errors.getErrorMessage(ERROR_YIELD)}
            label = "Yield"
            onChange = {(event) => handleChangeYield(event.target.value)}
            />
        </ListItem>
        <ListItem>
          <UnitedValue
            value = {servingInfo != null && servingInfo.servingSize != null ? servingInfo.servingSize : undefined}
            valueName = "Serving Size"
            unit = {servingInfo != null && servingInfo.unit != null  ? servingInfo.unit : undefined }
            setValue = {updateServingSize}
            setUnit = {updateServingSizeUnit}
            handleError = {handleServingSizeErrors}
            testIdValue = {FIELD_SERVING_SIZE}
            testIdUnit = {FIELD_SERVING_SIZE_UNIT}
            defaultValue = {servingInfo != null && servingInfo.servingSize != null ? servingInfo.servingSize : ''}
            defaultUnit = {servingInfo != null && servingInfo.unit != null  ? servingInfo.unit : ''}
          />
        </ListItem>
      </List>
    )
  }
  else if(!editable && servingInfo != null){
    content = (
      <List component = "ul">
        {
          servingInfo.numServed !== undefined && (
          <ListItem>
              <ListItemText primary={`Serves: ${servingInfo.numServed} ${servingInfo.numServed == 1 ? 'person': 'people'}`} />
          </ListItem>
          )
        }
        {
          servingInfo.yield !== undefined && (
            <ListItem>
              <ListItemText primary={`Yield: ${servingInfo.yield} servings`} />
            </ListItem>
          )
        }
        {
          servingInfo.servingSize !== undefined && (
            <ListItem>
              <ListItemText primary={`Serving size: ${servingInfo.servingSize} ${servingInfo.unit ? servingInfo.unit : ''}`} />
            </ListItem>
          )
        }
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