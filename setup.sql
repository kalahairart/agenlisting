
-- 1. Buat Tabel Villas
CREATE TABLE IF NOT EXISTS public.villas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    image_url TEXT NOT NULL,
    google_drive_link TEXT,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    price_monthly NUMERIC NOT NULL DEFAULT 0,
    price_yearly NUMERIC NOT NULL DEFAULT 0,
    agent_fee NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('Available', 'Rented', 'Maintenance')) DEFAULT 'Available'
);

-- 2. Aktifkan Row Level Security (RLS)
-- Ini memastikan data tidak bisa diakses sembarang orang tanpa konfigurasi
ALTER TABLE public.villas ENABLE ROW LEVEL SECURITY;

-- 3. Buat Kebijakan (Policies)
-- Kebijakan: Izinkan semua orang yang terautentikasi (login) untuk melihat data
CREATE POLICY "Enable read access for authenticated users" 
ON public.villas FOR SELECT 
TO authenticated 
USING (true);

-- Kebijakan: Izinkan semua orang yang terautentikasi untuk menambah data
CREATE POLICY "Enable insert for authenticated users" 
ON public.villas FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Kebijakan: Izinkan semua orang yang terautentikasi untuk mengubah data sendiri
CREATE POLICY "Enable update for authenticated users" 
ON public.villas FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Kebijakan: Izinkan semua orang yang terautentikasi untuk menghapus data
CREATE POLICY "Enable delete for authenticated users" 
ON public.villas FOR DELETE 
TO authenticated 
USING (true);

-- 4. Catatan Penting Mengenai User:
-- Supabase mengelola user di skema 'auth'. 
-- Untuk membuat user pertama Anda, cara TERBAIK dan TERAMAN adalah:
-- a. Buka Dashboard Supabase Anda.
-- b. Pergi ke menu "Authentication" -> "Users".
-- c. Klik "Add User" -> "Create new user".
-- d. Masukkan email: agent@villapro.com dan password pilihan Anda.
-- e. Anda sekarang bisa login di aplikasi menggunakan kredensial tersebut.
