'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '../lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'client' | 'admin' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize so the client reference is stable across renders.
  // Without this, supabase.auth changes on every render, causing the
  // useEffect to re-run and re-subscribe on every render.
  const supabase = useMemo(() => createClient(), []);

  const fetchUserProfile = useCallback(async (supabaseUser: SupabaseUser): Promise<User> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role')
        .eq('id', supabaseUser.id)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          name: data.name || supabaseUser.email?.split('@')[0] || '',
          email: data.email,
          role: data.role as UserRole,
        };
      }
    } catch {
      // Fall through to the metadata fallback below.
    }

    // Fallback: build user from Supabase auth metadata.
    // Covers new Google OAuth users with no row in the users table yet,
    // and any case where the DB query fails.
    const email = supabaseUser.email || '';
    const metadata = supabaseUser.user_metadata || {};
    return {
      id: supabaseUser.id,
      name: metadata.full_name || metadata.name || email.split('@')[0],
      email,
      role: 'client',
    };
  }, [supabase]);

  useEffect(() => {
    // 1. Get the current session on mount.
    supabase.auth.getUser()
      .then(async ({ data: { user: supabaseUser } }) => {
        if (supabaseUser) {
          const profile = await fetchUserProfile(supabaseUser);
          setUser(profile);
        }
      })
      .catch(() => {
        // Supabase unreachable — treat as logged out.
      })
      .finally(() => {
        setIsLoading(false);
      });

    // 2. Subscribe to future auth changes (sign-in, sign-out, token refresh).
    //    This fires for Google OAuth redirect sessions via SIGNED_IN event.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          try {
            const profile = await fetchUserProfile(session.user);
            setUser(profile);
          } catch {
            // fetchUserProfile should never throw (it has its own fallback),
            // but guard defensively so user is not left null on error.
            const u = session.user;
            const email = u.email || '';
            const meta = u.user_metadata || {};
            setUser({
              id: u.id,
              name: meta.full_name || meta.name || email.split('@')[0],
              email,
              role: 'client',
            });
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, fetchUserProfile]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw new Error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw new Error(error.message);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
