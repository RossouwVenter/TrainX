import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Role } from '../types';
import { getItem, setItem, deleteItem } from '../utils/storage';
import { loginUser, signupUser } from '../services/auth.service';

interface AuthContextType {
  currentUser: User | null;
  role: Role | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: Role) => Promise<void>;
  switchRole: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const savedRole = await getItem('ventri_role');
      const savedUser = await getItem('ventri_user');
      if (savedRole && savedUser) {
        setRole(savedRole as Role);
        setCurrentUser(JSON.parse(savedUser));
      }
    })();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginUser(email, password);
      setCurrentUser(user);
      setRole(user.role);
      await setItem('ventri_role', user.role);
      await setItem('ventri_user', JSON.stringify(user));
    } catch (err: any) {
      const message = err?.response?.data?.error || err?.message || 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string, selectedRole: Role) => {
    setLoading(true);
    setError(null);
    try {
      const user = await signupUser(email, password, name, selectedRole);
      setCurrentUser(user);
      setRole(user.role);
      await setItem('ventri_role', user.role);
      await setItem('ventri_user', JSON.stringify(user));
    } catch (err: any) {
      const message = err?.response?.data?.error || err?.message || 'Signup failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const switchRole = useCallback(async () => {
    setCurrentUser(null);
    setRole(null);
    setError(null);
    await deleteItem('ventri_role');
    await deleteItem('ventri_user');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        loading,
        error,
        login,
        signup,
        switchRole,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
