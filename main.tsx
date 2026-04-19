import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { DB } from "./lib/store";

// Initialise Firestore listeners then render
DB.init().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
