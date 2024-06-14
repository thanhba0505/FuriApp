import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";

import App from "~/App.jsx";
import theme from "~/theme.js";
import { Provider } from "react-redux";
import store, { persistor } from "~/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import SnackbarProviderCustom from "./components/SnackbarProviderCustom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    {/* <React.StrictMode> */}
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SnackbarProviderCustom>
            <App />
          </SnackbarProviderCustom>
        </PersistGate>
      </Provider>
    </CssVarsProvider>
    {/* </React.StrictMode> */}
  </>
);
