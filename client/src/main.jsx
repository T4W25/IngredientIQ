import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes"; 
import "./index.css"; // Or your global styles

import { ToastProvider } from "./Components/ui/use-toast"; // ✅ double check this path!


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ToastProvider>
  </React.StrictMode>

);
