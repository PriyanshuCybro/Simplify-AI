import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isTokenExpired = (token) => {
    try {
      const [, payload] = token.split('.');
      if (!payload) return true;

      const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
      const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '=');
      const decodedPayload = JSON.parse(atob(paddedPayload));
      if (!decodedPayload?.exp) return false;

      return decodedPayload.exp * 1000 <= Date.now();
    } catch (_error) {
      return true;
    }
  };

  const clearAuthState = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {
    // Check if user is already logged in via LocalStorage
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (!savedUser || !savedToken) {
      clearAuthState();
      setLoading(false);
      return;
    }

    if (isTokenExpired(savedToken)) {
      clearAuthState();
      setLoading(false);
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch (_error) {
      clearAuthState();
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuthState();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    clearAuthState();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);