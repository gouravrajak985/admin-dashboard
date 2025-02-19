import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  signUp: (email: string, password: string, name: string, phone: string, location: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setIsLoading: (isLoading) => set({ isLoading }),

  signUp: async (email, password, name, phone, location) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          location
        }
      }
    });

    if (authError) throw authError;
    if (authData.user) {
      set({ user: authData.user });
    }
  },

  signIn: async (email, password) => {
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      if (user) {
        set({ user });
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        set({ profile });
      }
    } catch (error) {
      throw error;
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null, profile: null });
  },

  loadUser: async () => {
    try {
      set({ isLoading: true });
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) throw authError;

      if (user) {
        set({ user });
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        set({ profile });
      } else {
        set({ user: null, profile: null });
      }
    } catch (error) {
      console.error('Error loading user:', error);
      set({ user: null, profile: null });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (data) => {
    const { user } = get();
    if (!user) throw new Error('No user logged in');

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    set({ profile });
  }
}));