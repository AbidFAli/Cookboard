import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import AddIcon from "@mui/icons-material/Add";
import PropTypes from "prop-types";
import React, { useState } from "react";

/*
 *@prop addNewBlankListItem
 * a function that adds a new list item to the @prop listItems passed to this component
 *@prop component
 * either "ul" or "ol"
 *@prop renderListItem(item, pos, addItemError, removeItemError)
 * a function that returns a component to represent an item in the list.
 *  @param item : the item to display
 *  @param pos: the position of the item in the list
 *  @param addItemError(id), removeItemError(id)
 *    use these functions to indicate to the FormList that there is an error in
 *    an item. They will be passed by the formList
 *@prop data-testid
 *  sets the data-testid
 *@prop editable
 * controls whether items should be editable
 *@prop idAddButton
 * sets the data-testid for the add button
 *@prop listItems
   the items in the list
 *@prop onListError
 * A function that will be called by FormList when there are errors in the list.
 *@prop onNoListError
 * A function that will be called by FormList when there are no errors in the list.
 */
const FormList = ({
  addNewBlankListItem,
  component,
  renderListItem,
  "data-testid": dataTestId,
  editable,
  idAddButton,
  listItems,
  onListError,
  onNoListError,
}) => {
  const [itemErrors, setItemErrors] = useState([]);

  const addItemError = (childId) => {
    let newErrors = [...itemErrors];
    newErrors.push(childId);

    //now there is a new error and this is the first error so perform callback
    if (onListError && itemErrors.length === 0) {
      onListError();
    }
    setItemErrors(newErrors);
  };

  const removeItemError = (childId) => {
    let newErrors = itemErrors.filter((id) => id !== childId);

    //this is the last error and it will be removed, perform callback
    if (onNoListError && itemErrors.length === 1) {
      onNoListError();
    }
    setItemErrors(newErrors);
  };

  let buttons = null;
  let content = null;
  if (listItems) {
    content = listItems.map((item, pos) => {
      return renderListItem(item, pos, addItemError, removeItemError);
    });
  }

  if (editable) {
    buttons = (
      <IconButton
        data-testid={idAddButton}
        onClick={() => addNewBlankListItem()}
        size="large">
        <AddIcon />
      </IconButton>
    );
  }

  return (
    <div data-testid={dataTestId}>
      <List component={component}>{content}</List>
      {buttons}
    </div>
  );
};

FormList.propTypes = {
  addNewBlankListItem: PropTypes.func.isRequired,
  component: PropTypes.string,
  dataTestId: PropTypes.string,
  editable: PropTypes.bool,
  listItems: PropTypes.array.isRequired,
  idAddButton: PropTypes.string,
  renderListItem: PropTypes.func.isRequired,
  onListError: PropTypes.func,
  onNoListError: PropTypes.func,
  "data-testid": PropTypes.string,
};

export { FormList };
