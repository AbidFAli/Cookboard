import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import PropTypes from "prop-types";

const theme = createMuiTheme();
const ThemeProviderHelper = (props) => {
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};

ThemeProviderHelper.propTypes = {
  children: PropTypes.any,
};

export { ThemeProviderHelper };
