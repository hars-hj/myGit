// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "./lib/api";

export type User = {
  _id: string;
  username: string;
  email: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type AuthContextValue = {
  user: User | null;
  isAuthed: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
  login: (data: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await api.get<User | { user: User }>("/api/me");
      const payload: any = res.data;
      setUser(payload.user ?? payload);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = async ({ email, password }: LoginInput) => {
    await api.post("/api/login", { email, password });
    await fetchMe();
  };

  const logout = async () => {
    await api.post("/api/logout");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthed: !!user,
      loading,
      refresh: fetchMe,
      login,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
