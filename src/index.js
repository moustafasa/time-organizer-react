import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import store from "./app/store";
import { Provider } from "react-redux";

// style
import "bootstrap/dist/css/bootstrap.min.css";

import "./sass/components/animations.scss";
import "./sass/components/buttons.scss";
import "./sass/components/fonts.scss";
import "./sass/components/globals.scss";
import "./sass/components/headings.scss";
import "./sass/components/inputs.scss";
import "./sass/normalize.css";
import "./sass/all.min.css";

import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </Provider>
);
