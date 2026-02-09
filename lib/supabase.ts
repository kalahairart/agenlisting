
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseConfig } from '../types';

// Anda bisa memasukkan URL dan KEY di sini secara manual jika tidak ingin menggunakan menu Settings
const MANUAL_URL = 'https://ndjwubzasyqunmasapjr.supabase.co'; 
const MANUAL_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kand1Ynphc3lxdW5tYXNhcGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTA1MjEsImV4cCI6MjA4NjIyNjUyMX0.OKHrnrPXPXotE-TaiLWSSkWVeusCq5YL1d7jq3w5ufw';

let supabaseInstance: SupabaseClient | null = null;

/**
 * Mendapatkan instance Supabase. 
 * Memprioritaskan config yang diberikan (dari UI), 
 * kemudian mengecek variabel manual di atas.
 */
export const getSupabase = (config?: SupabaseConfig | null): SupabaseClient | null => {
  // Jika sudah ada instance dan tidak ada config baru, kembalikan yang ada
  if (supabaseInstance && !config) return supabaseInstance;

  const url = config?.url || MANUAL_URL;
  const key = config?.anonKey || MANUAL_KEY;

  if (url && key) {
    try {
      supabaseInstance = createClient(url, key);
      return supabaseInstance;
    } catch (e) {
      console.error("Gagal menginisialisasi Supabase:", e);
      return null;
    }
  }

  return null;
};

export const clearSupabase = () => {
  supabaseInstance = null;
};
