import React, { createContext, useState } from "react";

// Tạo Context
export const AuthContext = createContext();

// AuthProvider bọc quanh App, cung cấp state "isAdmin" và hàm login/logout
export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);

  const login = () => setIsAdmin(true);
  const logout = () => setIsAdmin(false);

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
