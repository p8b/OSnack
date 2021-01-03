import React from "react";
import { render } from "react-dom";
import App from "./app";
import "osnack-frontend-shared/src/_core/type.Extensions";
import "osnack-frontend-shared/src/index";

render(<App />, document.getElementById("rootDiv"));
