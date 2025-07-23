import { createClient } from '@supabase/supabase-js';

let supabase = null;

export const initSupabase = (projectUrl, anonKey) => {
  if (!projectUrl || !anonKey) {
    throw new Error('Missing Supabase credentials');
  }
  
  supabase = createClient(projectUrl, anonKey);
  return supabase;
};

export const getSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase not initialized');
  }
  return supabase;
};