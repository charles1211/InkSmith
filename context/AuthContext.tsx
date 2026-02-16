'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '../lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Types
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchUserProfile = useCallback(async (supabaseUser: SupabaseUser): Promise<User> => {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('id', supabaseUser.id)
      .single();

    if (error || !data) {
      // Fallback if users table row doesn't exist yet
      const email = supabaseUser.email || '';
      const metadata = supabaseUser.user_metadata || {};
      return {
        id: supabaseUser.id,
        name: metadata.name || email.split('@')[0],
        email,
        role: 'client',
      };
    }

    return {
      id: data.id,
      name: data.name || supabaseUser.email?.split('@')[0] || '',
      email: data.email,
      role: data.role as UserRole,
    };
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user: supabaseUser } }) => {
      if (supabaseUser) {
        const profile = await fetchUserProfile(supabaseUser);
        setUser(profile);
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user);
        setUser(profile);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserProfile, supabase.auth]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    if (error) {
      throw new Error(error.message);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    setIsLoading(false);
    if (error) {
      throw new Error(error.message);
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      throw new Error(error.message);
    }
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
