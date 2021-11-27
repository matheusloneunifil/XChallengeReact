import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";
import App from "./App";
import configureStore from "./store/configureStore";
import { colors } from "./utilities/constants";
import "./sass/main.scss";

const store = configureStore();

const theme = createTheme({
  palette: {
    primary: {
      main: colors.PRIMARY,
    },
    secondary: {
      main: colors.DANGER,
      contrastText: "#ffffff",
    },
  },
});

const rootElement = document.getElementById("root");

render(
  <Provider store={store}>
    <Router>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Router>
  </Provider>,
  rootElement
);
