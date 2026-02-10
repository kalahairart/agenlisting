
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseConfig } from '../types';

let supabaseInstance: SupabaseClient | null = null;

/**
 * Mendapatkan instance Supabase.
 * Prioritas: 
 * 1. Config dari UI (LocalStorage)
 * 2. Environment Variables (Vercel)
 */
export const getSupabase = (config?: SupabaseConfig | null): SupabaseClient | null => {
  // Jika config paksa diberikan dari UI, buat instance baru
  if (config?.url && config?.anonKey) {
    return createClient(config.url, config.anonKey);
  }

  // Jika sudah ada instance default, gunakan itu
  if (supabaseInstance) return supabaseInstance;

  // Cek Environment Variables
  const envUrl = process.env.SUPABASE_URL;
  const envKey = process.env.SUPABASE_ANON_KEY;

  if (envUrl && envKey) {
    try {
      supabaseInstance = createClient(envUrl, envKey);
      return supabaseInstance;
    } catch (e) {
      console.error("Gagal menginisialisasi Supabase dari ENV:", e);
    }
  }

  return null;
};
