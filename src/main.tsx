import { ConvexAuthProvider } from "@convex-dev/auth/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { convex } from "./lib/convex";
import { App } from "./App";
import "./styles/globals.css";

/** Renders the Docket application with routing, Convex and authentication context. */
function renderApplication(): void {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <BrowserRouter>
        <ConvexAuthProvider client={convex}>
          <App />
        </ConvexAuthProvider>
      </BrowserRouter>
    </React.StrictMode>,
  );
}

renderApplication();
