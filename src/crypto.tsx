import React from "react";
import { createRoot } from "react-dom/client";
import CryptoPreview from "../app/crypto/page";
import "../app/globals.css";

createRoot(document.getElementById("root")!).render(<React.StrictMode><CryptoPreview /></React.StrictMode>);
