import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
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
  modifyInstructions,
  dispatchErrors,
}) => {
  const addBlankInstruction = () => {
    modifyInstructions({ type: "add", text: "" });
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
        modifyInstructions={modifyInstructions}
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

InstructionList.propTypes = {
  instructions: PropTypes.array,
  editable: PropTypes.bool,
  modifyInstructions: PropTypes.func,
  dispatchErrors: PropTypes.func,
};

const InstructionListItem = ({
  instr,
  pos,
  editable,
  modifyInstructions,
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
    modifyInstructions({ type: "edit", index: pos, text: newText });
    checkForErrors(newText);
  };

  const handleRemoveWrapper = () => {
    removeInstructionError(instr.id);
    modifyInstructions({ type: "remove", index: pos });
  };

  if (editable) {
    return (
      <ListItem component="li">
        <ListItemText primary={`${1 + pos}.`} />
        <TextField
          variant="standard"
          value={instrText}
          id={"TEXT_FIELD_INSTRUCTION_" + instr.id}
          label={LABEL_INSTRUCTION_TEXT_FIELD}
          onChange={(event) => handleEditWrapper(event.target.value)}
          error={errorMessage != null}
          helperText={errorMessage}
          multiline />
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

InstructionListItem.propTypes = {
  instr: PropTypes.instanceOf(Instruction),
  pos: PropTypes.number,
  editable: PropTypes.bool,
  modifyInstructions: PropTypes.func.isRequired,
  addInstructionError: PropTypes.func,
  removeInstructionError: PropTypes.func,
};

export {
  InstructionList,
  ERROR_BLANK_INSTRUCTION,
  ID_BUTTON_ADD_INSTRUCTION,
  ID_FIELD_NEW_INSTRUCTION,
  ID_INSTRUCTION_LIST,
  LABEL_INSTRUCTION_TEXT_FIELD,
};
