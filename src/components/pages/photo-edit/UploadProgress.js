import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import React from "react";

const UploadProgress = (props) => {
  return (
    <Box>
      <CircularProgress variant="determinate" value={props.progress} />
      <Typography>{`${Math.floor(props.progress)}%`}</Typography>
    </Box>
  );
};

UploadProgress.propTypes = {
  progress: PropTypes.number.isRequired,
};
export { UploadProgress };
