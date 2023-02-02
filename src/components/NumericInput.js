import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import React, { useState } from "react";

const ERROR_MESSAGE_NAN = "Enter a number";

/*
A Component that parses numerical input and displays error messages. See PropTypes for description of the validator function. 
The validator will run and the value will update when this component loses focus.
Use the useErrorMessenger hook in a parent component to provide the errors object and the addError and removeError functions
*/
function NumericInput({
  validator,
  value,
  setValue,
  errors,
  valueName,
  addError,
  removeError,
  "data-testid": dataTestId,
  variant,
}) {
  const [valueText, setValueText] = useState(value ? value.toString() : "0");

  const handleValueTextChange = (event) => {
    setValueText(event.target.value);
  };

  function handleBlur(event) {
    let num = Number(event.target.value);
    let errorMessage = "";
    if (Number.isNaN(num)) {
      errorMessage = ERROR_MESSAGE_NAN;
    } else if (validator) {
      errorMessage = validator(num);
    }

    if (errorMessage !== "") {
      addError(valueName, errorMessage);
    } else {
      removeError(valueName);
      setValue(num);
    }
  }
  return (
    <TextField
      label={valueName}
      id={"NUM_" + valueName}
      value={valueText}
      onChange={handleValueTextChange}
      onBlur={handleBlur}
      error={errors.hasError(valueName)}
      helperText={errors.getErrorMessage(valueName)}
      inputProps={{ "data-testid": dataTestId }}
      variant={variant}
    />
  );
}

NumericInput.propTypes = {
  value: PropTypes.number.isRequired,

  /*
   *setValue(value: Number)
   */
  setValue: PropTypes.func.isRequired,
  valueName: PropTypes.string.isRequired,
  addError: PropTypes.func.isRequired,
  removeError: PropTypes.func.isRequired,
  /*
  validator: (value: number, text: String) -> (errorMessage: string)
  Use the validator to check for errors other than input being NaN, which is handled by this component. 
  Validator should return "" if no errors. This method will run on blur.
  */
  validator: PropTypes.func,
  errors: PropTypes.object.isRequired,
  variant: PropTypes.string,
  "data-testid": PropTypes.string,
};

export { NumericInput, ERROR_MESSAGE_NAN };
