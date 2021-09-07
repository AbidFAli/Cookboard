import axios from "axios";
import { authHeaderForUser } from "./recipeServiceHelper";

const BASE_URL = "http://localhost:3001/api/recipes";

/*
 * *@returns {
 * url: String; the url to save to
 * fields: key,value pairs to be POSTed along with the photo
 *}
 */
const getPhotoSaveURL = async (recipeId, user, fileName) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/${recipeId}/photos/save/url`,
      { fileName },
      {
        headers: authHeaderForUser(user),
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//where to get key or just get from db?
/*
 *file: photo file
 */
const uploadPhoto = async (url, fields, file) => {
  let bodyData = new FormData();
  //think these should be strings
  bodyData.append("Content-Type", file.type);
  for (const fieldName in fields) {
    bodyData.append(fieldName, fields[fieldName]);
  }
  bodyData.append("file", file);
  return axios.post(url, bodyData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/*
 *@param file: instance of File class
 *@param recipe: recipe to save the photo for
 *@param user: the current user
 *@returns location: URL at which to access the saved photo
 */
const performSave = async (file, recipeId, user) => {
  try {
    let { url, fields } = await getPhotoSaveURL(recipeId, user, file.name);
    const response = await uploadPhoto(url, fields, file);
  } catch (error) {
    console.log(error);
  }

  //await sendSaveSuccess()
};
/*
 *@param metadata: {
 *  key: string; key for photo. Required.
 *  caption: caption for photo
 *}
 *@param recipeId: id for the recipe
 *@param user: user making the request
 */
const sendSaveSuccess = async (metadata, recipeId, user) => {
  let url = `${BASE_URL}/${recipeId}/photos/save/success`;
  await axios.post(url, metadata, {
    headers: authHeaderForUser(user),
  });
};

//use this one, other stuff is exported for testing purposes
const recipePhotoService = {
  performSave,
};

export {
  recipePhotoService,
  getPhotoSaveURL,
  uploadPhoto,
  sendSaveSuccess,
  performSave,
};
