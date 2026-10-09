import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [loading, setLoading] = useState(false);

  const loginUser = async (username, password) => {
    setLoading(true);
    try {
      const data = await authService.login(username, password);
      setUser(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    authService.logout();
    setUser(null);
  };

  const hasRole = (role) => {
    return user && user.role === role;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loginUser, logoutUser, hasRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
