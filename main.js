import React from "react";
import ReactDOM from "react-dom";
import App from "./src/App.js";
import "react-toastify/dist/ReactToastify.css";
import "./src/app.css";
import "./src/common.css";
import "./src/materialoverride.css";
import registerServiceWorker from "./src/registerServiceWorker";

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
