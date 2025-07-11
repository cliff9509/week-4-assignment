import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  setUserInfo,
  getUserInfo,
  removeUserInfo,
} from '../utils/auth';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserInfo());
  const [token, setToken] = useState(getAuthToken());

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      setToken(data.token);
      setUser(data);
      setAuthToken(data.token);
      setUserInfo(data);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/api/auth/register', {
        name,
        email,
        password,
      });
      setToken(data.token);
      setUser(data);
      setAuthToken(data.token);
      setUserInfo(data);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    removeAuthToken();
    removeUserInfo();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);