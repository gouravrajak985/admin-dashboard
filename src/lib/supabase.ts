/**
 * Supabase Client Configuration
 * 
 * This module initializes and exports the Supabase client instance
 * used throughout the application for database operations and authentication.
 * 
 * Environment Variables Required:
 * - VITE_SUPABASE_URL: The URL of your Supabase project
 * - VITE_SUPABASE_ANON_KEY: The anonymous key for client-side access
 */
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create and export Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);