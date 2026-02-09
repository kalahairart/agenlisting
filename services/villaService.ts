
import { getSupabase } from '../lib/supabase';
import { Villa, SupabaseConfig } from '../types';

/**
 * Service untuk mengelola data Villa di Supabase.
 * Memisahkan logika database dari komponen UI.
 */
export const villaService = {
  async fetchAll(config: SupabaseConfig | null): Promise<Villa[]> {
    const supabase = getSupabase(config);
    if (!supabase) throw new Error("Supabase tidak terkonfigurasi");

    const { data, error } = await supabase
      .from('villas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async insert(villa: Partial<Villa>, config: SupabaseConfig | null): Promise<Villa> {
    const supabase = getSupabase(config);
    if (!supabase) throw new Error("Supabase tidak terkonfigurasi");

    const { data, error } = await supabase
      .from('villas')
      .insert([villa])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Villa>, config: SupabaseConfig | null): Promise<Villa> {
    const supabase = getSupabase(config);
    if (!supabase) throw new Error("Supabase tidak terkonfigurasi");

    const { data, error } = await supabase
      .from('villas')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string, config: SupabaseConfig | null): Promise<void> {
    const supabase = getSupabase(config);
    if (!supabase) throw new Error("Supabase tidak terkonfigurasi");

    const { error } = await supabase
      .from('villas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
