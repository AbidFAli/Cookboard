import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
//import {UnitedValue, ERROR_TYPE_UNIT, ERROR_TYPE_VALUE} from './UnitedValue'
import { Ingredient } from "../../../Model/ingredient";
import { FormList } from "../../FormList";

//Non-unique testids
const ID_DELETE_INGREDIENT_BUTTON = "deleteIngredientButton";
const ID_FIELD_INGREDIENT_AMOUNT = "ingredientAmountField";
const ID_FIELD_INGREDIENT_NAME = "ingredientNameField";
const ID_FIELD_INGREDIENT_UNIT = "ingredientUnitField";

//Unique testIds

const ID_BUTTON_ADD_INGREDIENT = "startAddButton";

//Error Keys
const ERROR_KEY_INGREDIENT_LIST = "keyErrorIngredientList";

//Error Messsages
const ERROR_MESSAGE_AMOUNT_NAN = "Amount must be a number";
const ERROR_MESSAGE_AMOUNT_MISSING = "Amount required";
const ERROR_MESSAGE_NAME_MISSING = "Name required";
const ERROR_MESSAGE_INGREDIENT_LIST =
  "There is an error in one of the ingredients";

/*
 *@prop ingredients
 *@prop editable
 *@prop modifyIngredients
 *@prop dispatchErrors
 */
const IngredientList = (props) => {
  const addBlankIngredient = () => {
    props.modifyIngredients({ type: "add", ingredient: new Ingredient() });
  };

  const renderIngredientListItem = (
    ingr,
    pos,
    addIngredientError,
    removeIngredientError
  ) => {
    return (
      <IngredientListItem
        key={ingr.id}
        ingr={ingr}
        editable={props.editable}
        modifyIngredients={props.modifyIngredients}
        dispatchErrors={props.dispatchErrors}
        addIngredientError={addIngredientError}
        removeIngredientError={removeIngredientError}
      />
    );
  };

  const notifyIngredientListError = () => {
    props.dispatchErrors({
      type: "add",
      errorKey: ERROR_KEY_INGREDIENT_LIST,
      errorMessage: ERROR_MESSAGE_INGREDIENT_LIST,
    });
  };

  const removeIngredientListError = () => {
    props.dispatchErrors({
      type: "remove",
      errorKey: ERROR_KEY_INGREDIENT_LIST,
    });
  };

  return (
    <FormList
      addNewBlankListItem={addBlankIngredient}
      component="ul"
      editable={props.editable}
      idAddButton={ID_BUTTON_ADD_INGREDIENT}
      renderListItem={renderIngredientListItem}
      listItems={props.ingredients}
      onListError={notifyIngredientListError}
      onNoListError={removeIngredientListError}
    />
  );
};

IngredientList.propTypes = {
  editable: PropTypes.bool,
  modifyIngredients: PropTypes.func.isRequired,
  dispatchErrors: PropTypes.func,
  ingredients: PropTypes.array,
};

/*
 *@prop ingr
 *@prop editable
 *@prop modifyIngredients
 *@prop dispatchErrors
 *@ensures if amountText is a valid number, then ingr's amount is a number.
 */
const IngredientListItem = ({
  ingr,
  editable,
  modifyIngredients,
  addIngredientError,
  removeIngredientError,
}) => {
  const [amountErrorMessage, setAmountErrorMessage] = useState(null);
  const [nameErrorMessage, setNameErrorMessage] = useState(null);

  //gives a warning about dependencies for addIngredientError and removeIngredientError, but they are functions
  //Adding them causes infinite loop of updates. Seems to work fine without them as dependencies.
  useEffect(() => {
    const checkForErrors = (ingr) => {
      let amount = Number(ingr.amount);
      let hasErrors = false;
      let amountErrorMessage = null;
      let nameErrorMessage = null;

      if (amount === 0) {
        amountErrorMessage = ERROR_MESSAGE_AMOUNT_MISSING;
        hasErrors = true;
      } else if (!Number.isFinite(amount)) {
        amountErrorMessage = ERROR_MESSAGE_AMOUNT_NAN;
        hasErrors = true;
      }

      if (!ingr.name) {
        nameErrorMessage = ERROR_MESSAGE_NAME_MISSING;
        hasErrors = true;
      }
      setAmountErrorMessage(amountErrorMessage);
      setNameErrorMessage(nameErrorMessage);

      if (hasErrors) {
        addIngredientError(ingr.id);
      } else {
        removeIngredientError(ingr.id);
      }
    };

    if (editable) {
      checkForErrors(ingr);
    }
  }, [ingr, editable]);

  const handleNameChange = (name) => {
    let editedIngredient = { ...ingr };
    editedIngredient.name = name;
    modifyIngredients({ type: "edit", ingredient: editedIngredient });
  };

  const handleAmountChange = (text) => {
    let amountText = text.trim();
    let amount = Number(amountText);
    let editedIngredient = { ...ingr };
    editedIngredient.amount = amountText;

    if (amountText !== "" && Number.isFinite(amount)) {
      editedIngredient.amount = amount;
    }
    modifyIngredients({ type: "edit", ingredient: editedIngredient });
  };

  const handleUnitChange = (text) => {
    let unit = text.trim();
    let editedIngredient = { ...ingr };
    editedIngredient.unit = unit;
    modifyIngredients({ type: "edit", ingredient: editedIngredient });
  };

  const handleRemoveWrapper = () => {
    removeIngredientError(ingr.id);
    modifyIngredients({ type: "remove", ingredient: ingr });
  };

  if (editable) {
    return (
      <ListItem data-testid={ingr.id}>
        <TextField
          variant="standard"
          label="Name"
          id={"INGR_NAME_" + ingr.id}
          value={ingr != null && ingr.name != null ? ingr.name : ""}
          onChange={(event) => handleNameChange(event.target.value)}
          error={nameErrorMessage != null}
          helperText={nameErrorMessage} />
        <TextField
          variant="standard"
          label="Amount"
          id={"INGR_AMOUNT_" + ingr.id}
          inputProps={{ "data-testid": ID_FIELD_INGREDIENT_AMOUNT }}
          value={ingr != null && ingr.amount != null ? ingr.amount : ""}
          onChange={(event) => handleAmountChange(event.target.value)}
          error={amountErrorMessage != null}
          helperText={amountErrorMessage} />
        <TextField
          variant="standard"
          label="Unit"
          id={"INGR_UNIT_" + ingr.id}
          inputProps={{ "data-testid": ID_FIELD_INGREDIENT_UNIT }}
          value={ingr != null && ingr.unit != null ? ingr.unit : ""}
          onChange={(event) => handleUnitChange(event.target.value)} />
        <IconButton
          size="small"
          data-testid={ID_DELETE_INGREDIENT_BUTTON}
          onClick={handleRemoveWrapper}
        >
          <DeleteIcon />
        </IconButton>
      </ListItem>
    );
  } else {
    return (
      <ListItem>
        <ListItemText
          primary={`${ingr.name}, ${ingr.amount} ${ingr.unit ?? ""}`}
        />
      </ListItem>
    );
  }
};

IngredientListItem.propTypes = {
  ingr: PropTypes.object,
  editable: PropTypes.bool,
  modifyIngredients: PropTypes.func.isRequired,
  dispatchErrors: PropTypes.func,
  addIngredientError: PropTypes.func,
  removeIngredientError: PropTypes.func,
};

export {
  IngredientList,
  ERROR_MESSAGE_AMOUNT_MISSING,
  ERROR_MESSAGE_NAME_MISSING,
  ERROR_MESSAGE_AMOUNT_NAN,
  ERROR_KEY_INGREDIENT_LIST,
  ID_DELETE_INGREDIENT_BUTTON,
  ID_FIELD_INGREDIENT_AMOUNT,
  ID_FIELD_INGREDIENT_UNIT,
  ID_FIELD_INGREDIENT_NAME,
  ID_BUTTON_ADD_INGREDIENT,
};
