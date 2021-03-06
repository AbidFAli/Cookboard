import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/recipes'
const MESSAGE_DELETE_SUCCESS = "deletion successful"
const MESSAGE_DELETE_FAIL = "deletion failed"

const authHeaderForUser = (user) => {
  return {'Authorization': `Bearer ${user.token}`}
}

const create = async (recipe, user) => {
  try{
    const result = await axios.post(BASE_URL + '/', recipe, {headers: authHeaderForUser(user)});
    return result.data;
  }catch(error){
    console.log(error)
  }
}

const getById = async (id) => {
  try{
    const result = await axios.get(BASE_URL + `/${id}`);
    return result.data;
  }catch(error){
    console.log(error)
  }
}

const getAll = async () => {
  try{
    const result = await axios.get(BASE_URL + '/');
    return result.data;
  }catch(error){
    console.log(error)
  }
}

const update = async (recipe, user) => {
  try{
    const result = await axios.put(BASE_URL + `/${recipe.id}`, recipe, {headers: authHeaderForUser(user)});
    return result.data;
  }
  catch(error){
    console.log(error)
  }
}

const destroy = async (recipe, user) => {
  try{
    await axios.delete(BASE_URL + `/${recipe.id}`, {headers: authHeaderForUser(user)})
  }
  catch(error){
    console.log(error)
  }
}


let recipeService = {
  create,
  getById,
  getAll,
  update,
  destroy
}

export default recipeService;