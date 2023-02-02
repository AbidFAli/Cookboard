import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
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
