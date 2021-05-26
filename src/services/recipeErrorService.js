//locks? since shared data
//shouldn't since removing different errors.

class RecipeErrorService {
  constructor(){
    if(!RecipeErrorService.instance){
      this._errors = new Set()
      RecipeErrorService.instance = this
    }

    return RecipeErrorService.instance;
  }

  addError(error){
    this._errors.add(error)
  }

  removeError(error){
    return this._errors.delete(error)
  }

  hasError(error){
    return this._errors.has(error)
  }

  numErrors(){
    return this._errors.size()
  }

  clear(){
    this._errors.clear()
  }
}

const singleton = new RecipeErrorService()
Object.freeze(singleton)
export default RecipeErrorService