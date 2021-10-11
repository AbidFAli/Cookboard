import Typography from '@material-ui/core/Typography';
import React from 'react';
import { UnitedValue } from '../../UnitedValue';


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
    let errorKey = null, errorMessage = null, errorInfo = {};

    //use truthy/falsy equivlance to cover '', null, undefined, 0 cases as missing
    if(ttmValue && !Number.isFinite(ttmValue)){
      errorKey = ERROR_TTM_VALUE
      errorMessage = ERROR_MESSAGE_TTM_VALUE_NAN
      errorInfo = {errorMessageValue : ERROR_MESSAGE_TTM_VALUE_NAN }
    }
    else if(ttmValue && ttmUnit === ''){
      errorKey = ERROR_TTM_UNIT
      errorMessage = ERROR_MESSAGE_TTM_UNIT_MISSING
      errorInfo = {errorMessageUnit : ERROR_MESSAGE_TTM_UNIT_MISSING }
    }
    else if(!ttmValue && ttmUnit !== ''){
      errorKey = ERROR_TTM_VALUE
      errorMessage = ERROR_MESSAGE_TTM_VALUE_MISSING
      errorInfo = {errorMessageValue : ERROR_MESSAGE_TTM_VALUE_MISSING }
    }

    if(errorKey != null){
      dispatchErrors({type : 'add', errorKey : errorKey, errorMessage : errorMessage})
    }

    return errorInfo;
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
  else if(timeToMake != null && timeToMake.value != null && timeToMake.unit != null){
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

