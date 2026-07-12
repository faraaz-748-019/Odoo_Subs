import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE } from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved token
    const savedToken = localStorage.getItem('eco_token');
    const savedUser = localStorage.getItem('eco_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (jwt, userData) => {
    localStorage.setItem('eco_token', jwt);
    localStorage.setItem('eco_user', JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('eco_token');
    localStorage.removeItem('eco_user');
    setToken(null);
    setUser(null);
  };

  // Setup generic fetch wrapper that automatically adds Auth headers
  const apiFetch = async (url, options = {}) => {
    if (!token) throw new Error('Not authenticated');
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };

    const response = await fetch(`${API_BASE}${url}`, { ...options, headers });
    
    if (response.status === 401) {
      logout();
      throw new Error('Session expired');
    }
    
    return response.json();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, apiFetch }}>
      {children}
    </AuthContext.Provider>
  );
};
