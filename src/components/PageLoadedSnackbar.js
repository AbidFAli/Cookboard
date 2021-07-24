import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';


//idea from https://material-ui.com/components/snackbars/#SimpleSnackbar.js

const ID_BUTTON_CLOSE_LOADED_NOTE = "PageLoadedSnackbarCloseLoadedNotification"
/*
*@prop message
*@prop open
*@prop onClose
*@prop message
*/
const PageLoadedSnackbar = (props) => {
  return (
    <Snackbar
      anchorOrigin ={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      open = {props.open}
      message = {props.message}
      onClose = {props.onClose}
      autoHideDuration = {6000}
      action = {
        <React.Fragment>
          <IconButton 
            size="small" 
            aria-label="close" 
            color="inherit" 
            onClick={props.onClose}
            data-testid = {ID_BUTTON_CLOSE_LOADED_NOTE}
            >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
    />
  );
}

export {
  ID_BUTTON_CLOSE_LOADED_NOTE,
  PageLoadedSnackbar
};

