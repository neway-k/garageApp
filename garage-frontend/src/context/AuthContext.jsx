import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [employee, setEmployee] = useState(
    JSON.parse(localStorage.getItem("employee")) || null
  );

  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("employee", JSON.stringify(userData));
    setToken(newToken);
    setEmployee(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("employee");
    setToken(null);
    setEmployee(null);
    setIsAuthenticated(false);
  };

  // Optional: Auto-validate token on initial load if needed

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated, employee, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
