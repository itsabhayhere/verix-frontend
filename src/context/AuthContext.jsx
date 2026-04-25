'use client';

import React, {
  createContext,
  useState,
  useEffect,
  useContext
} from 'react';

import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.data || null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    restoreSession();
  }, []);

  const redirectByRole = (role) => {
    if (role === 'admin') {
      router.replace('/admin');
    } else {
      router.replace('/dashboard');
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', {
      email,
      password
    });

    const loggedUser = res.data.data.user;

    setUser(loggedUser);

    redirectByRole(loggedUser.role);
  };

  const register = async (payload) => {
    const res = await api.post('/auth/register', payload);

    const newUser = res.data.data.user;

    setUser(newUser);

    redirectByRole(newUser.role);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}

    setUser(null);

    router.replace('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,   // ✅ add this line

        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};