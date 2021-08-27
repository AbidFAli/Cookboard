import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from "@material-ui/icons/Delete";
import PropTypes from "prop-types";
import React, { useState } from "react";
import Instruction from "../../../Model/instruction";
import { FormList } from "../../FormList";

//error key
const ERROR_KEY_INSTRUCTION_LIST = "keyErrorInstructionList";

const ERROR_BLANK_INSTRUCTION = "Enter an instruction";

//ids
const ID_FIELD_NEW_INSTRUCTION = "newInstructionField";
const ID_BUTTON_ADD_INSTRUCTION = "addingInstructionButton";
const ID_INSTRUCTION_LIST = "idInstructionList";

const LABEL_INSTRUCTION_TEXT_FIELD = "Instruction";

const InstructionList = ({
  instructions,
  editable,
  handleAdd,
  handleRemove,
  handleEdit,
  dispatchErrors,
}) => {
  const addBlankInstruction = () => {
    handleAdd(new Instruction());
  };

  const renderInstruction = (
    instruction,
    pos,
    addInstructionError,
    removeInstructionError
  ) => {
    return (
      <InstructionListItem
        key={instruction.id}
        instr={instruction}
        pos={pos}
        editable={editable}
        handleEdit={handleEdit}
        handleRemove={handleRemove}
        addInstructionError={addInstructionError}
        removeInstructionError={removeInstructionError}
      />
    );
  };

  const notifyInstructionListError = () => {
    dispatchErrors({
      type: "add",
      errorKey: ERROR_KEY_INSTRUCTION_LIST,
      errorMessage: "",
    });
  };

  const removeInstructionListError = () => {
    dispatchErrors({ type: "remove", errorKey: ERROR_KEY_INSTRUCTION_LIST });
  };

  return (
    <FormList
      addNewBlankListItem={addBlankInstruction}
      component="ol"
      data-testid={ID_INSTRUCTION_LIST}
      editable={editable}
      listItems={instructions}
      idAddButton={ID_BUTTON_ADD_INSTRUCTION}
      onListError={notifyInstructionListError}
      onNoListError={removeInstructionListError}
      renderListItem={renderInstruction}
    />
  );
};

const InstructionListItem = ({
  instr,
  pos,
  editable,
  handleEdit,
  handleRemove,
  addInstructionError,
  removeInstructionError,
}) => {
  const [instrText, setInstrText] = useState(instr != null ? instr.text : "");
  const [errorMessage, setErrorMessage] = useState(null);

  const checkForErrors = (instrText) => {
    let errorMessage = null;
    if (instrText.trim() === "") {
      errorMessage = ERROR_BLANK_INSTRUCTION;
      addInstructionError(instr.id);
    } else {
      removeInstructionError(instr.id);
    }
    setErrorMessage(errorMessage);
  };

  const handleEditWrapper = (newText) => {
    setInstrText(newText);
    handleEdit(pos, newText);
    checkForErrors(newText);
  };

  const handleRemoveWrapper = () => {
    removeInstructionError(instr.id);
    handleRemove(pos);
  };

  if (editable) {
    return (
      <ListItem component="li">
        <ListItemText primary={`${1 + pos}.`} />
        <TextField
          value={instrText}
          id={"TEXT_FIELD_INSTRUCTION_" + instr.id}
          label={LABEL_INSTRUCTION_TEXT_FIELD}
          onChange={(event) => handleEditWrapper(event.target.value)}
          error={errorMessage != null}
          helperText={errorMessage}
        />
        <IconButton size="small" onClick={handleRemoveWrapper}>
          <DeleteIcon />
        </IconButton>
      </ListItem>
    );
  } else {
    return (
      <ListItem component="li">
        <ListItemText primary={`${1 + pos}. ${instrText}`} />
      </ListItem>
    );
  }
};

InstructionList.propTypes = {
  instructions: PropTypes.array,
  editable: PropTypes.bool,
  handleEdit: PropTypes.func,
  handleAdd: PropTypes.func,
  handleRemove: PropTypes.func,
  dispatchErrors: PropTypes.func,
};

export {
  InstructionList,
  ERROR_BLANK_INSTRUCTION,
  ID_BUTTON_ADD_INSTRUCTION,
  ID_FIELD_NEW_INSTRUCTION,
  ID_INSTRUCTION_LIST,
  LABEL_INSTRUCTION_TEXT_FIELD,
};
