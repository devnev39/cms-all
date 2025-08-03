import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./scss/styles.scss";
import { Provider } from "react-redux";
import store from "./app/store.js";
import * as bootstrap from "bootstrap";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
