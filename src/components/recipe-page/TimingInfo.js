import React from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import {UnitedValue, ERROR_TYPE_UNIT, ERROR_TYPE_VALUE } from './UnitedValue'

const ERROR_MESSAGE_TTM_VALUE_MISSING = "Prep Time(value) missing"
const ERROR_MESSAGE_TTM_UNIT_MISSING = "Prep Time(unit) missing"
const ERROR_MESSAGE_TTM_VALUE_NAN = "Prep Time(value) must be a number"

//Error ids
const ERROR_TTM_VALUE = "keyErrorTTMValue"
const ERROR_TTM_UNIT = "keyErrorTTMUnit"

const ID_FIELD_TTM_VALUE = "fieldTimeToMakeValue"
const ID_FIELD_TTM_UNIT = "fieldTimeToMakeUnit"

const TimingInfo = ({timeToMake, setTimeToMake, editable, errors, dispatchErrors}) => {
  
  const handleTimeToMakeErrors = (ttmValue, ttmUnit) => {
    dispatchErrors({type: 'remove', errorKey: ERROR_TTM_VALUE})
    dispatchErrors({type: 'remove', errorKey: ERROR_TTM_UNIT})
    let errorKey = null, errorMessage = null, errorType = null;

    if(ttmValue != undefined  && !Number.isFinite(ttmValue)){
      errorKey = ERROR_TTM_VALUE
      errorMessage = ERROR_MESSAGE_TTM_VALUE_NAN
      errorType = ERROR_TYPE_VALUE
    }
    else if(ttmValue != undefined && ttmUnit == undefined){
      errorKey = ERROR_TTM_UNIT
      errorMessage = ERROR_MESSAGE_TTM_UNIT_MISSING
      errorType = ERROR_TYPE_UNIT
    }
    else if(ttmValue == undefined && ttmUnit != undefined){
      errorKey = ERROR_TTM_VALUE
      errorMessage = ERROR_MESSAGE_TTM_VALUE_MISSING
      errorType = ERROR_TYPE_VALUE
    }

    if(errorKey != null){
      dispatchErrors({type : 'add', errorKey : errorKey, errorMessage : errorMessage})
    }

    return [errorType, errorMessage]
  }


  const updateTTMValue = (newValue) => {
    let newTimeToMake = {...timeToMake}
    newTimeToMake.value = newValue
    setTimeToMake(newTimeToMake)
  }

  const updateTTMUnit = (newUnit) => {
    let newTimeToMake = {...timeToMake}
    newTimeToMake.unit = newUnit
    setTimeToMake(newTimeToMake)

  }

  if(editable){
      return(
          <React.Fragment>
              <UnitedValue
                value = {timeToMake != null && timeToMake.value != null ? timeToMake.value : 0}
                unit = {timeToMake != null && timeToMake.unit != null ? timeToMake.unit : '' }
                valueName = "Prep Time"
                setValue = {updateTTMValue}
                setUnit = {updateTTMUnit}
                handleError = {handleTimeToMakeErrors}
                testIdValue = {ID_FIELD_TTM_VALUE}
                testIdUnit = {ID_FIELD_TTM_UNIT}
              />
          </React.Fragment>
      )
  }
  else if(timeToMake != null && timeToMake.value != undefined && timeToMake.unit != undefined){
      return(
        <Typography variant="h4">
          {timeToMake.value + ' ' + timeToMake.unit}
        </Typography>
      )
  }
  else{
    return null
  }
}

export {
    TimingInfo,
    ID_FIELD_TTM_UNIT,
    ID_FIELD_TTM_VALUE,
    ERROR_MESSAGE_TTM_UNIT_MISSING,
    ERROR_MESSAGE_TTM_VALUE_MISSING,
    ERROR_MESSAGE_TTM_VALUE_NAN
};