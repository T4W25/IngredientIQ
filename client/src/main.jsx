import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes"; 
import "./index.css"; // Or your global styles

// Corrected import for react-toastify
import { ToastContainer } from 'react-toastify';  // Use ToastContainer instead of ToastProvider
import 'react-toastify/dist/ReactToastify.css';  // Don't forget to import the CSS for Toastify

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer />  {/* Add this to display toasts */}
    </BrowserRouter>
  </React.StrictMode>
);
