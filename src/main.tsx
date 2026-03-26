import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import NeverThree from "./app/App";
import { AppProviders } from "./providers/AppProviders";

const el = document.getElementById("root");
if (!el) throw new Error("Missing #root");

createRoot(el).render(
  <StrictMode>
    <AppProviders>
      <NeverThree />
    </AppProviders>
  </StrictMode>,
);
