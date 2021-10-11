import axios from "axios";
import { authHeaderForUser } from "./recipeServiceHelper";

const BASE_URL = "http://localhost:3001/api/recipes";

//perhaps make this a class. Have it store the recipeId and user since you access it sooo much.

/*
 * *@returns {
 * url: String; the url to save to
 * fields: key,value pairs to be POSTed along with the photo
 *}
 */
const getPhotoSaveURL = async (recipeId, user, fileName) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/${recipeId}/photos/uploadUrl`,
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
 *Saves the photo image
 *@param photoFile: file for the image
 *@param recipe: recipe to save the photo for
 *@param user: the current user
 *@returns key
 */
const saveImage = async (photoFile, recipeId, user) => {
  try {
    let { url, fields } = await getPhotoSaveURL(recipeId, user, photoFile.name);
    await uploadPhoto(url, fields, photoFile);
    return fields.key;
  } catch (error) {
    console.log(error);
  }
};

/*
 *Sets the recipe photo metadata(recipe.photos) in the database. Will replace existing metadata
 *@param metadata: [{
 *  key: string; key for photo. Required.
 *  caption: caption for photo
 *}]
 *@param recipeId: id for the recipe
 *@param user: user making the request
 */
const savePhotos = async (metadata, recipeId, user) => {
  let url = `${BASE_URL}/${recipeId}/photos`;
  await axios.put(
    url,
    { photos: metadata },
    {
      headers: authHeaderForUser(user),
    }
  );
};

//use this one, other stuff is exported for testing purposes
const recipePhotoService = {
  saveImage,
  savePhotos,
};

export { recipePhotoService };
