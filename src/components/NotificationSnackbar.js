import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import PropTypes from "prop-types";
import React, { useImperativeHandle, useState } from "react";

//idea from https://material-ui.com/components/snackbars/#SimpleSnackbar.js

const ID_BUTTON_CLOSE_NOTIFICATION =
  "idNotificationSnackbar_close_notification";
/*
 *@prop open
 *@prop onClose
 *@prop message
 */
const NotificationSnackbar = (props) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={props.open}
      message={props.message}
      onClose={props.onClose}
      autoHideDuration={6000}
      action={
        <React.Fragment>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={props.onClose}
            data-testid={ID_BUTTON_CLOSE_NOTIFICATION}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
    />
  );
};

NotificationSnackbar.propTypes = {
  open: PropTypes.bool,
  message: PropTypes.string,
  onClose: PropTypes.func,
};

/*
*@desc a component to control a snackbar. Create a ref and pass it to 
  this component to access the following methods:
  displayMessage(message) : display a notification for several seconds.
  
*@prop ref
*@prop onOpen
*@prop onClose
*/
const SnackbarProvider = React.forwardRef((props, ref) => {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const displayMessage = (message) => {
    setMessage(message);
    setOpen(true);
    if (props.onOpen) {
      props.onOpen();
    }
  };

  useImperativeHandle(ref, () => {
    return {
      displayMessage,
    };
  });

  const closeSnackbar = () => {
    setOpen(false);
    if (props.onClose) {
      props.onClose();
    }
  };

  return (
    <NotificationSnackbar
      message={message}
      open={open}
      onClose={closeSnackbar}
    />
  );
});

SnackbarProvider.propTypes = {};
export { ID_BUTTON_CLOSE_NOTIFICATION, SnackbarProvider, NotificationSnackbar };
