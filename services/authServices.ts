import { getSupabase } from '../lib/supabase';
import { SupabaseConfig } from '../types';

export const authService = {
  async signIn(email: string, password: string, config: SupabaseConfig | null) {
    const supabase = getSupabase(config);
    if (!supabase) throw new Error("Database belum dikonfigurasi. Silakan isi URL dan Key di menu Database.");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut(config: SupabaseConfig | null) {
    const supabase = getSupabase(config);
    if (supabase) {
      await supabase.auth.signOut();
    }
  },

  async getSession(config: SupabaseConfig | null) {
    const supabase = getSupabase(config);
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session;
  }
};
