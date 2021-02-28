import React from "react";
import { render } from "react-dom";
import "osnack-frontend-shared/src/_core/type.Extensions";
import "osnack-frontend-shared/src/index";
import ContextContainer from "./_core/Contexts/contextContainer";


render(<ContextContainer />, document.getElementById("rootDiv"));
