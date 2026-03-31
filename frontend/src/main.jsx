import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
//use this to disable the react dev tools in production
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
