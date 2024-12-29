import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAdmin } = useContext(AuthContext);

  if (!isAdmin) {
    // Chưa đăng nhập → điều hướng sang /admin-login
    return <Navigate to="/admin-login" replace />;
  }

  // Đã đăng nhập → render children (ví dụ DeviceList, AddDevice)
  return children;
}

export default ProtectedRoute;
