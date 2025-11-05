'use client';

import {
  AuthContextType,
  UserProfile,
} from '@/interfaces/auth-interface/auth-types';
import axios, { AxiosError } from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE}/auth`;

// empty by default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component to avoid props drill
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // On first load, check if the user already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_URL}/me`, {
          withCredentials: true,
        }); // This route to remember logged in use even though refresh the page
        setUser(res.data.user || res.data.profile); // In this step, backend should send {user: {}}
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(
        `${API_URL}/login`,
        { email, password },
        { withCredentials: true },
      );


      setUser(res.data.profile);
    } catch (error: Error | unknown) {
      const axiosError = error as AxiosError;
      console.error(
        'Login Failed:',
        axiosError.response?.data || axiosError.message,
      );
      throw error;
    }
  };

  // Logout Function
  const logout = async () => {
    await axios.post(`${API_URL}/log-out`, {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth msut be used within AuthProvider');
  }
  return ctx;
};
