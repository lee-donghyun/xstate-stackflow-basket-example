import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "@stackflow/plugin-basic-ui/index.css";

import { Stack as AppStack } from "./stack/app";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppStack />
  </StrictMode>,
);
