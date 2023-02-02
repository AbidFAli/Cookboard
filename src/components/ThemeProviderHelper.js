import { createTheme, StyledEngineProvider } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import PropTypes from "prop-types";

const theme = createTheme();
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
