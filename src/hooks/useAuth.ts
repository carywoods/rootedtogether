import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('🔄 Attempting sign up for:', email);
      console.log('Supabase URL being used:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Environment mode:', import.meta.env.MODE);
      console.log('Is production:', import.meta.env.PROD);
      console.log('Key type:', import.meta.env.VITE_SUPABASE_ANON_KEY?.includes('service_role') ? '⚠️ SERVICE ROLE' : '✅ ANON KEY');
      
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error('Supabase configuration is missing. Please check your environment variables.');
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Supabase sign up error:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          statusText: error.statusText,
          hint: error.hint,
          details: error.details,
        });
        return { data, error };
      }
      
      console.log('✅ Sign up successful:', data);
      console.log('User created:', data.user ? '✅ Yes' : '❌ No');
      console.log('Session created:', data.session ? '✅ Yes' : '❌ No');
      return { data, error };
    } catch (networkError) {
      console.error('❌ Network error during sign up:', networkError);
      console.error('Network error details:', {
        name: networkError.name,
        message: networkError.message,
        stack: networkError.stack,
      });
      return { 
        data: null, 
        error: { 
          message: `Network error: ${networkError.message}. Please check your internet connection and Supabase configuration.`,
          details: networkError
        } 
      };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refetchProfile: () => user && fetchProfile(user.id),
  };
}