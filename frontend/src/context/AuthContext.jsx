import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage if available
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('quickcart_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('quickcart_user') !== null;
  });

  const login = (userData) => {
    console.log('AuthContext: Logging in user:', userData);
    setUser(userData);
    setIsAuthenticated(true);
    // Persist user data to localStorage
    localStorage.setItem('quickcart_user', JSON.stringify(userData));
  };

  const logout = () => {
    console.log('AuthContext: Logging out user');
    setUser(null);
    setIsAuthenticated(false);
    // Clear user data from localStorage
    localStorage.removeItem('quickcart_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
