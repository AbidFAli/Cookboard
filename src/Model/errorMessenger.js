//locks? since shared data
//shouldn't since removing different errors.

import {cloneDeep} from 'lodash'

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


export default ErrorMessenger