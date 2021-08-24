//locks? since shared data
//shouldn't since removing different errors.

import { cloneDeep } from 'lodash'
import { useReducer } from 'react'

class ErrorMessenger {
  constructor(otherService){
      if(otherService === undefined){
        this._errors = new Map()
      }
      else{
        this._errors = cloneDeep(otherService._errors)
      }
  }

  //adds the [errorKey,errorMessage] pair, returning a new ErrorMessenger
  addError(errorKey, errorMessage){
    let newManager = new ErrorMessenger(this)
    newManager._errors.set(errorKey, errorMessage)
    return newManager
  }

  //removes the [errorKey,errorMessage] pair, returning a new ErrorMessenger
  removeError(errorKey){
    let newManager = new ErrorMessenger(this)
    newManager._errors.delete(errorKey)
    return newManager
  }

  hasError(errorKey){
    return this._errors.has(errorKey)
  }

  getErrorMessage(errorKey){
    return this._errors.get(errorKey)
  }

  size(){
    return this._errors.size
  }
}

//errors is an instance of the ErrorMessenger class
function reduceErrors(errors, action){
  const newErrors = new ErrorMessenger(errors)
  switch(action.type) {
    case 'add':
      return newErrors.addError(action.errorKey, action.errorMessage);
    case 'remove':
      return newErrors.removeError(action.errorKey);
    case 'reset':
      return new ErrorMessenger();
    default:
      return newErrors
  }
}

function useErrorMessenger(props){
  const [errors, dispatchErrors] = useReducer(reduceErrors, new ErrorMessenger())

  const addError = (valueName, message) => {
    dispatchErrors({type: 'add', errorKey: valueName, errorMessage: message})
  }

  const removeError = (valueName) => {
    dispatchErrors({type: 'remove', errorKey: valueName})
  }

  const resetErrors = () => {
    dispatchErrors({type: 'reset'})
  }

  return {
    errors, addError, removeError, resetErrors
  }
}


export { ErrorMessenger, reduceErrors, useErrorMessenger }

