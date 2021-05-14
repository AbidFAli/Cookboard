import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/recipes'
const create = (recipe) => {
  return axios.post(BASE_URL + '/', recipe).then(result => result.data)
}

const getById = (id) => {
  return axios.get(BASE_URL + `/${id}`).then((result) => result.data)
}

const getAll = () => {
  return axios.get(BASE_URL + '/').then((result) => result.data)
}

const update = (recipe) => {
  return axios.put(BASE_URL + `/${recipe.id}`, recipe).then(result => result.data)
}

const destroy = (recipe) => {

}




export default {create, getById, getAll, update, destroy};