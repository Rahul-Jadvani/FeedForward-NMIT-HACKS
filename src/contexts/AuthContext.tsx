
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { toast } from "sonner";

type User = {
  id: string;
  email: string;
  name?: string;
  userType?: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error: any | null }>;
  signup: (email: string, password: string, userData: Partial<User>) => Promise<{ error: any | null }>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  session: null,
  login: async () => ({ error: null }),
  signup: async () => ({ error: null }),
  logout: async () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    user: User | null;
    session: Session | null;
    loading: boolean;
  }>({
    isAuthenticated: false,
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        updateAuthState(session);
        toast.success("Successfully signed in!");
      } else if (event === 'SIGNED_OUT') {
        setAuthState({
          isAuthenticated: false,
          user: null,
          session: null,
          loading: false,
        });
        toast.success("Successfully signed out!");
        // Removed direct navigation to avoid the router issue
      }
    });

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      updateAuthState(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateAuthState = (session: Session | null) => {
    if (session?.user) {
      const user: User = {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
        userType: session.user.user_metadata?.userType || 'individual',
      };
      
      setAuthState({
        isAuthenticated: true,
        user,
        session,
        loading: false,
      });
    } else {
      setAuthState({
        isAuthenticated: false,
        user: null,
        session: null,
        loading: false,
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) return { error };
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signup = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            userType: userData.userType,
          },
          emailRedirectTo: window.location.origin,
        }
      });

      if (error) return { error };
      
      // Create a basic profile when a user signs up (we use any type to avoid TS errors)
      try {
        await supabase
          .from('profiles')
          .insert([
            {
              id: data.user?.id,
              full_name: userData.name,
              updated_at: new Date().toISOString()
            }
          ]);
      } catch (profileError) {
        console.error("Error creating profile:", profileError);
        // Continue anyway as the trigger should handle this
      }
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
        session: authState.session,
        login,
        signup,
        logout,
        loading: authState.loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
