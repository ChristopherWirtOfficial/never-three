import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import NeverThree from "./app/App";
import { AppBootstrap } from "./providers/AppBootstrap";

const el = document.getElementById("root");
if (!el) throw new Error("Missing #root");

createRoot(el).render(
  <StrictMode>
    <AppBootstrap>
      <NeverThree />
    </AppBootstrap>
  </StrictMode>,
);
