
import React, { useState } from 'react';
import { Database, Save, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { SupabaseConfig } from '../types';

interface SettingsProps {
  config: SupabaseConfig | null;
  onSave: (config: SupabaseConfig) => void;
}

const Settings: React.FC<SettingsProps> = ({ config, onSave }) => {
  const [formData, setFormData] = useState<SupabaseConfig>(config || { url: '', anonKey: '' });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Database Settings</h2>
        <p className="text-gray-500 mt-1">Connect your application to Supabase for real-time data persistence.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-2xl text-indigo-700">
          <Database size={24} />
          <div>
            <p className="text-sm font-bold">Supabase Integration</p>
            <p className="text-xs opacity-80">Store your villa data securely in the cloud.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 ml-1">Project URL</label>
            <input
              required
              type="url"
              value={formData.url}
              onChange={e => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
              placeholder="https://your-project.supabase.co"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 ml-1">Anon Key</label>
            <input
              required
              type="password"
              value={formData.anonKey}
              onChange={e => setFormData({ ...formData, anonKey: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white font-mono text-sm"
              placeholder="your-anon-key"
            />
          </div>

          <div className="pt-4 flex flex-col gap-4">
            <button
              type="submit"
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] ${
                isSaved ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700'
              }`}
            >
              {isSaved ? <CheckCircle2 size={20} /> : <Save size={20} />}
              {isSaved ? 'Connected & Saved' : 'Connect to Supabase'}
            </button>

            <a 
              href="https://supabase.com/dashboard" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors"
            >
              Open Supabase Dashboard <ExternalLink size={12} />
            </a>
          </div>
        </form>
      </div>

      <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
        <AlertCircle className="text-amber-500 shrink-0" size={20} />
        <div className="text-sm text-amber-800">
          <p className="font-bold mb-1">Requirements:</p>
          <p className="opacity-90">Ensure you have a table named <code className="bg-amber-100 px-1 rounded font-mono">villas</code> in your Supabase project with columns matching the app's data structure (name, location, price_monthly, etc.).</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
