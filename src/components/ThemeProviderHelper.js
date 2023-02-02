import { createMuiTheme, ThemeProvider, StyledEngineProvider } from "@mui/material";
import PropTypes from "prop-types";

const theme = createMuiTheme();
const ThemeProviderHelper = (props) => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </StyledEngineProvider>
  );
};

ThemeProviderHelper.propTypes = {
  children: PropTypes.any,
};

export { ThemeProviderHelper };
