'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { authApi } from '@/services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirm: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User['profile']> & { name?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'shopsphere_auth_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Client-side initialization to avoid hydration mismatch
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedToken) {
      setToken(storedToken);
      authApi.getMe(storedToken)
        .then((fetchedUser) => {
          setUser(fetchedUser);
        })
        .catch(() => {
          // Token is invalid/expired
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem(TOKEN_KEY, response.token);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, passwordConfirm: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.register({
        name,
        email,
        password,
        password_confirm: passwordConfirm,
      });
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem(TOKEN_KEY, response.token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await authApi.logout(token);
      } catch {
        // Ignore logout error if already expired
      }
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: Partial<User['profile']> & { name?: string }) => {
    if (!token) throw new Error('Not authenticated');
    const updatedUser = await authApi.updateProfile(data, token);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
