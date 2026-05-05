import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <AccessibilityProvider>
      <App />
    </AccessibilityProvider>
  </ThemeProvider>
);
