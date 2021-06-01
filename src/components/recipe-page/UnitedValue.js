import React, {useState} from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types'




const ERROR_TYPE_UNIT = "UnitError"
const ERROR_TYPE_VALUE = "ValueError"


//see PropTypes for info on props
const UnitedValue = (props) => {
  const [valueErrorMessage, setValueErrorMessage] = useState(null)
  const [unitErrorMessage, setUnitErrorMessage] = useState(null)
  let inputPropsValue = props.testIdValue != null ? {'data-testid' : props.testIdValue} : null ;
  let inputPropsUnit = props.testIdUnit != null ? {'data-testid': props.testIdUnit} : null ;



  const setErrorMessages = (errorInfo) => {
    if(errorInfo[0] === ERROR_TYPE_UNIT ){
      setValueErrorMessage(null)
      setUnitErrorMessage(errorInfo[1])
    }
    else if(errorInfo[0] === ERROR_TYPE_VALUE){
      setUnitErrorMessage(null)
      setValueErrorMessage(errorInfo[1])
    }
    else{
      setUnitErrorMessage(null)
      setValueErrorMessage(null)
    }
  }

  const handleChangeValue = (newValueText) => {
    let newValue = newValueText
    if(newValueText.trim() != '' && Number.isFinite(Number(newValueText))){
      newValue = Number(newValueText)
    }
    else if(newValueText.trim() == ''){
      newValue = undefined
    }

    props.setValue(newValue)
    
    let errorInfo = props.handleError(newValue, props.unit)
    setErrorMessages(errorInfo)
}

const handleChangeUnit = (newUnitText) => {
    let newUnit = newUnitText.trim() != '' ? newUnitText.trim() : undefined ;
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
  value: PropTypes.number.isRequired,
  valueName: PropTypes.string.isRequired, //must be unique
  unit: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired, //setValue(newValue : Number | undefined)
  setUnit: PropTypes.func.isRequired, //setUnit(newUnit : String | undefined)
  handleError : PropTypes.func.isRequired, // handleError(value, unit) -> [ERROR_UNIT || ERROR_VALUE || null, errorMessage || null]
  testIdUnit: PropTypes.string,
  testIdValue: PropTypes.string,
  defaultValue: PropTypes.number,
  defaultUnit: PropTypes.string
}

export { UnitedValue, ERROR_TYPE_UNIT, ERROR_TYPE_VALUE};