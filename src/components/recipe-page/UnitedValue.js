//import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import React, { useState } from 'react';




//see PropTypes for info on props
const UnitedValue = (props) => {
  const [valueErrorMessage, setValueErrorMessage] = useState(null)
  const [unitErrorMessage, setUnitErrorMessage] = useState(null)
  let inputPropsValue = props.testIdValue != null ? {'data-testid' : props.testIdValue} : null ;
  let inputPropsUnit = props.testIdUnit != null ? {'data-testid': props.testIdUnit} : null ;



  const setErrorMessages = (errorInfo) => {
      setUnitErrorMessage(errorInfo.errorMessageUnit !== undefined ? errorInfo.errorMessageUnit : null)
      setValueErrorMessage(errorInfo.errorMessageValue !== undefined ? errorInfo.errorMessageValue : null)
    
  }

  const handleChangeValue = (newValueText) => {
    let newValue = newValueText
    if(newValueText.trim() !== '' && Number.isFinite(Number(newValueText))){
      newValue = Number(newValueText)
    }
    else if(newValueText.trim() === ''){
      newValue = null
    }

    props.setValue(newValue)
    
    let errorInfo = props.handleError(newValue, props.unit)
    setErrorMessages(errorInfo)
}

const handleChangeUnit = (newUnitText) => {
    let newUnit = newUnitText.trim();
    props.setUnit(newUnit)

    let errorInfo = props.handleError(props.value, newUnit)
    setErrorMessages(errorInfo)
}
  
  return (
    <React.Fragment>
      <TextField
          inputProps = {inputPropsValue} 
          defaultValue= {props.value != null ? props.value : ''}
          label = {props.valueName ?? null}
          error = {valueErrorMessage != null}
          helperText = {valueErrorMessage}
          onChange = {(event) => handleChangeValue(event.target.value)}
      />
      <TextField
          inputProps =  {inputPropsUnit}
          defaultValue= {props.unit != null ? props.unit : ''}
          label = {props.valueName != null ? props.valueName + ' (Unit)': null}
          error = {unitErrorMessage != null}
          helperText = {unitErrorMessage}
          onChange = {(event) => handleChangeUnit(event.target.value)}
      />
    </React.Fragment>
  )

}

UnitedValue.propTypes = {
  //This component will parse value strings into numbers if possible
  value: PropTypes.string || PropTypes.number,
  valueName: PropTypes.string.isRequired,
  unit: PropTypes.string,

  //setValue(newValue : Number | null)
  setValue: PropTypes.func.isRequired,

  //setUnit(newUnit : String | null)
  setUnit: PropTypes.func.isRequired, 

  // handleError(value, unit) -> {errorMessageUnit: String , errorMessageValue: String}
  //returns an object optionally containing error messages for unit and value
  handleError : PropTypes.func.isRequired, 

  testIdUnit: PropTypes.string,
  testIdValue: PropTypes.string,
}

export { UnitedValue };

