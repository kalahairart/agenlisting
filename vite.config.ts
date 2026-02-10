
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL || 'https://ndjwubzasyqunmasapjr.supabase.co'),
    'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kand1Ynphc3lxdW5tYXNhcGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTA1MjEsImV4cCI6MjA4NjIyNjUyMX0.OKHrnrPXPXotE-TaiLWSSkWVeusCq5YL1d7jq3w5ufw')
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
