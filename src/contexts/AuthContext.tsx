'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Define admin email - use environment variable or fallback
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@davidspector.com';

  useEffect(() => {
    setMounted(true);
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        const userIsAdmin = session?.user?.email === adminEmail;
        setIsAdmin(userIsAdmin);
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        const userIsAdmin = session?.user?.email === adminEmail;
        setIsAdmin(userIsAdmin);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [adminEmail]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      // Manually update state in case auth state change doesn't trigger
      if (data?.user) {
        setUser(data.user);
        setSession(data.session);
        const userIsAdmin = data.user.email === adminEmail;
        setIsAdmin(userIsAdmin);
      }
      
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
    isAdmin,
  };

  // Return children directly without wrapper div
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return a default context instead of throwing an error
    return {
      user: null,
      session: null,
      loading: true,
      signIn: async () => ({ error: new Error('Auth not initialized') }),
      signOut: async () => {},
      isAdmin: false,
    };
  }
  return context;
} 