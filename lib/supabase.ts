
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseConfig } from '../types';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (config?: SupabaseConfig): SupabaseClient | null => {
  if (config && config.url && config.anonKey) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey);
    } catch (e) {
      console.error("Failed to initialize Supabase:", e);
      supabaseInstance = null;
    }
  }
  return supabaseInstance;
};

export const clearSupabase = () => {
  supabaseInstance = null;
};
