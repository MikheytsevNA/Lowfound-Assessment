// main.tsx
import { createRoot } from "react-dom/client";
import { createApp } from "./base"
import "./index.css";

const root = createRoot(document.getElementById("root")!);
root.render(createApp());