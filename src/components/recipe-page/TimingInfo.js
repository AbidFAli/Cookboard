import React from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const ERROR_MESSAGE_TTM_VALUE_MISSING = "Prep Time(value) missing"
const ERROR_MESSAGE_TTM_UNIT_MISSING = "Prep Time(unit) missing"
const ERROR_MESSAGE_TTM_VALUE_NAN = "Prep Time(value) must be a number"

const KEY_ERROR_TTM_VALUE = "keyErrorTTMValue"
const KEY_ERROR_TTM_UNIT = "keyErrorTTMUnit"

const ID_FIELD_TTM_VALUE = "fieldTimeToMakeValue"
const ID_FIELD_TTM_UNIT = "fieldTimeToMakeUnit"

const TimingInfo = ({timeToMake, setTimeToMake, editable, errors, dispatchErrors}) => {
  
  
  const handleChangeTTMValue = (newValueText) => {
      let newTimeToMake = {...timeToMake}
      let newValue = newValueText
      if(newValueText.trim() != '' && Number.isFinite(Number(newValueText))){
        newValue = Number(newValueText)
      }
      else if(newValueText.trim() == ''){
        newValue = undefined
      }
      newTimeToMake.value = newValue
      setTimeToMake(newTimeToMake)
      
      dispatchErrors({type: 'remove', errorKey:KEY_ERROR_TTM_VALUE })
      dispatchErrors({type: 'remove', errorKey: KEY_ERROR_TTM_UNIT })
      if(newTimeToMake.value != undefined && !Number.isFinite(Number(newValueText))){
        dispatchErrors({type: 'add', errorKey: KEY_ERROR_TTM_VALUE,  errorMessage: ERROR_MESSAGE_TTM_VALUE_NAN})
      }
      else if(newTimeToMake.value != undefined && newTimeToMake.unit == undefined){
        dispatchErrors({type: 'add', errorKey: KEY_ERROR_TTM_UNIT, errorMessage: ERROR_MESSAGE_TTM_VALUE_NAN})
      }
      else if(newTimeToMake.value == undefined && newTimeToMake.unit != undefined){
        dispatchErrors({type: 'add', errorKey: KEY_ERROR_TTM_VALUE, errorMessage: ERROR_MESSAGE_TTM_VALUE_MISSING})
      }
  }

  const handleChangeTTMUnit = (newUnitText) => {
      let newTimeToMake = {...timeToMake}
      newTimeToMake.unit = newUnitText.trim() != '' ? newUnitText.trim() : undefined ;
      setTimeToMake(newTimeToMake)

      dispatchErrors({type: 'remove', errorKey:KEY_ERROR_TTM_VALUE })
      dispatchErrors({type: 'remove', errorKey: KEY_ERROR_TTM_UNIT })
      if(newTimeToMake.unit != undefined && newTimeToMake.value == undefined){
        dispatchErrors({type: 'add', errorKey: KEY_ERROR_TTM_VALUE, errorMessage: ERROR_MESSAGE_TTM_UNIT_MISSING})
      }
      else if(newTimeToMake.unit == undefined && newTimeToMake.value != undefined){
        dispatchErrors({type: 'add', errorKey: KEY_ERROR_TTM_UNIT, errorMessage: ERROR_MESSAGE_TTM_UNIT_MISSING})
      }
  }

  if(editable){
      return(
          <React.Fragment>
              <TextField
                  inputProps = {{'data-testid' : ID_FIELD_TTM_VALUE}}
                  defaultValue= {timeToMake != null ? timeToMake.value : ''}
                  label = "Prep Time(value)"
                  error = {errors.hasError(KEY_ERROR_TTM_VALUE)}
                  helperText = {errors.getErrorMessage(KEY_ERROR_TTM_VALUE)}
                  onChange = {(event) => handleChangeTTMValue(event.target.value)}
              />
              <TextField
                  inputProps = {{'data-testid' : ID_FIELD_TTM_UNIT}}
                  defaultValue= {timeToMake != null ? timeToMake.unit : ''}
                  label = "Prep Time(unit)"
                  error = {errors.hasError(KEY_ERROR_TTM_UNIT)}
                  helperText = {errors.getErrorMessage(KEY_ERROR_TTM_UNIT)}
                  onChange = {(event) => handleChangeTTMUnit(event.target.value)}
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
    ERROR_MESSAGE_TTM_VALUE_MISSING
};