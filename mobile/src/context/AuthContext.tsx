import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Role } from '../types';
import { getItem, setItem, deleteItem } from '../utils/storage';
import { getCoach, getAthletes as fetchAthleteList } from '../services/auth.service';

interface AuthContextType {
  currentUser: User | null;
  role: Role | null;
  athletes: User[];
  loading: boolean;
  selectRole: (role: Role) => Promise<void>;
  selectAthlete: (user: User) => void;
  switchRole: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [athletes, setAthletes] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const savedRole = await getItem('trainx_role');
      const savedUser = await getItem('trainx_user');
      if (savedRole && savedUser) {
        setRole(savedRole as Role);
        setCurrentUser(JSON.parse(savedUser));
      }
    })();
  }, []);

  const selectRole = useCallback(async (selectedRole: Role) => {
    setLoading(true);
    try {
      if (selectedRole === 'COACH') {
        const coach = await getCoach();
        setCurrentUser(coach);
        setRole('COACH');
        await setItem('trainx_role', 'COACH');
        await setItem('trainx_user', JSON.stringify(coach));
      } else {
        const list = await fetchAthleteList();
        setAthletes(list);
        setRole('ATHLETE');
        await setItem('trainx_role', 'ATHLETE');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const selectAthlete = useCallback(async (user: User) => {
    setCurrentUser(user);
    await setItem('trainx_user', JSON.stringify(user));
  }, []);

  const switchRole = useCallback(async () => {
    setCurrentUser(null);
    setRole(null);
    setAthletes([]);
    await deleteItem('trainx_role');
    await deleteItem('trainx_user');
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, role, athletes, loading, selectRole, selectAthlete, switchRole }}
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
