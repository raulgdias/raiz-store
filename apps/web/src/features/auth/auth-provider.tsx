"use client";

import type { AuthResponse, UserSummary } from "@raizstore/contracts";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "raizstore-session";

interface Session {
  accessToken: string;
  user: UserSummary;
}

interface AuthContextValue {
  session: Session | null;
  hydrated: boolean;
  saveSession(response: AuthResponse): void;
  logout(): void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrate = () => {
      const value = window.localStorage.getItem(STORAGE_KEY);
      if (value) {
        try {
          setSession(JSON.parse(value) as Session);
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
      setHydrated(true);
    };
    queueMicrotask(hydrate);
  }, []);

  const saveSession = useCallback((response: AuthResponse) => {
    const value = { accessToken: response.accessToken, user: response.user };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    setSession(value);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  const contextValue = useMemo(
    () => ({ session, hydrated, saveSession, logout }),
    [session, hydrated, saveSession, logout]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  return context;
}
