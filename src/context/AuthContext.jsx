import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

// Custom hook for easier usage
export const useAuth = () => useContext(AuthContext);

// Context provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // null if not logged in

  useEffect(() => {
    // Try to load user from localStorage on first load
    const storedUser = localStorage.getItem('journal-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username, password) => {
    // Simulated auth logic — replace with real API call later
    if (username === 'test' && password === '1234') {
      const userObj = { username };
      setUser(userObj);
      localStorage.setItem('journal-user', JSON.stringify(userObj));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('journal-user');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
