
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { AuthState, AuthUser } from '@/types/auth';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  authState: AuthState;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoaded: false,
  });
  
  const navigate = useNavigate();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            // Don't make a Supabase call directly in the callback
            // Use setTimeout to prevent potential deadlocks
            setTimeout(async () => {
              const profile = await fetchProfile(session.user.id);
              
              setAuthState({
                user: {
                  id: session.user.id,
                  email: session.user.email,
                  username: profile?.username,
                  avatarUrl: profile?.avatar_url,
                  age: profile?.age,
                  height: profile?.height,
                },
                session,
                isLoaded: true,
              });
            }, 0);
          }
        }
        
        if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            session: null,
            isLoaded: true,
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        
        setAuthState({
          user: {
            id: session.user.id,
            email: session.user.email,
            username: profile?.username,
            avatarUrl: profile?.avatar_url,
            age: profile?.age,
            height: profile?.height,
          },
          session,
          isLoaded: true,
        });
      } else {
        setAuthState({
          user: null,
          session: null,
          isLoaded: true,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (!error) {
      navigate('/');
    }
    
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (!error) {
      // Success message but stay on auth page as they need to verify email
    }
    
    return { error };
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      }
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        signIn, 
        signUp, 
        signOut,
        signInWithGoogle, 
        authState 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
