import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { auth, provider, signInWithPopup, signOut, onAuthStateChanged } from "../firebase";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const token = await u.getIdToken();  
        setIdToken(token);
      } else {
        setIdToken(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async () => {
    await signInWithPopup(auth, provider);      
  };

  const logout = async () => {
    await signOut(auth);                       
  };

  const value = useMemo(() => ({
    user,
    idToken,
    isAuthenticated: !!user,
    loading,                                   
    login,
    logout,
  }), [user, idToken, loading]);

  //  placeholder during initial auth check 
  // prolly get rid of later idk 
  if (loading) return <div style={{ height: 1 }} />;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
