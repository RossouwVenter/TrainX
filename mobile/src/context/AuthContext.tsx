import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Role } from '../types';
import { getItem, setItem, deleteItem } from '../utils/storage';
import { getAthletes as fetchAthleteList, loginCoach, signupCoach } from '../services/auth.service';

interface AuthContextType {
  currentUser: User | null;
  role: Role | null;
  athletes: User[];
  loading: boolean;
  error: string | null;
  loginAsCoach: (email: string, password: string) => Promise<void>;
  signupAsCoach: (email: string, password: string, name: string) => Promise<void>;
  selectRole: (role: Role) => Promise<void>;
  selectAthlete: (user: User) => void;
  switchRole: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [athletes, setAthletes] = useState<User[]>([]);
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

  const loginAsCoach = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const coach = await loginCoach(email, password);
      setCurrentUser(coach);
      setRole('COACH');
      await setItem('ventri_role', 'COACH');
      await setItem('ventri_user', JSON.stringify(coach));
    } catch (err: any) {
      const message = err?.response?.data?.error || err?.message || 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signupAsCoach = useCallback(async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);
    try {
      const coach = await signupCoach(email, password, name);
      setCurrentUser(coach);
      setRole('COACH');
      await setItem('ventri_role', 'COACH');
      await setItem('ventri_user', JSON.stringify(coach));
    } catch (err: any) {
      const message = err?.response?.data?.error || err?.message || 'Signup failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const selectRole = useCallback(async (selectedRole: Role) => {
    setLoading(true);
    setError(null);
    try {
      if (selectedRole === 'ATHLETE') {
        const list = await fetchAthleteList();
        setAthletes(list);
        setRole('ATHLETE');
        await setItem('ventri_role', 'ATHLETE');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const selectAthlete = useCallback(async (user: User) => {
    setCurrentUser(user);
    await setItem('ventri_user', JSON.stringify(user));
  }, []);

  const switchRole = useCallback(async () => {
    setCurrentUser(null);
    setRole(null);
    setAthletes([]);
    setError(null);
    await deleteItem('ventri_role');
    await deleteItem('ventri_user');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        athletes,
        loading,
        error,
        loginAsCoach,
        signupAsCoach,
        selectRole,
        selectAthlete,
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
