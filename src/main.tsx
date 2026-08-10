import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/anek-latin/wght.css";
import "@fontsource-variable/anek-devanagari/wght.css";
import "@fontsource-variable/newsreader";
import "@fontsource-variable/jetbrains-mono/wght.css";
import App from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
