import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./redux/store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import "./styles/reset.css";

ReactDOM.render(
  <Provider store={store}>
    <App />
    <Toaster />
  </Provider>,
  document.getElementById("dapp-container")
);

reportWebVitals();
