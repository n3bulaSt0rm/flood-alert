import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import reportWebVitals from "./reportWebVitals";
import { Toaster } from "react-hot-toast";

import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer";
import { Provider } from "react-redux";

import { BrowserRouter } from "react-router-dom";

// ====== IMPORT AuthProvider ======
import { AuthProvider } from "./context/AuthContext";

const store = configureStore({
  reducer: rootReducer,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        {/* Bọc thêm AuthProvider ở đây */}
        <AuthProvider>
          <App />
          <Toaster />
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
