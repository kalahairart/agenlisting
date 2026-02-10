
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import VillaCard from './components/VillaCard';
import VillaForm from './components/VillaForm';
import Settings from './components/Settings';
import { Villa, VillaStatus, SupabaseConfig } from './types';
import { Search, Plus, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { villaService } from './services/villaService';
import { authService } from './services/authService';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig | null>(() => {
    const saved = localStorage.getItem('supabase_config');
    return saved ? JSON.parse(saved) : null;
  });

  const [villas, setVillas] = useState<Villa[]>([]);
  const [editingVilla, setEditingVilla] = useState<Villa | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Cek sesi login saat aplikasi dimuat
  useEffect(() => {
    const checkSession = async () => {
      if (supabaseConfig) {
        const currentSession = await authService.getSession(supabaseConfig);
        setSession(currentSession);
      }
    };
    checkSession();
  }, [supabaseConfig]);

  // Sync data dari database jika sudah login
  useEffect(() => {
    if (session && supabaseConfig) {
      syncData();
    }
  }, [session, supabaseConfig]);

  const syncData = async () => {
    setIsLoading(true);
    try {
      const data = await villaService.fetchAll(supabaseConfig);
      setVillas(data);
    } catch (e) {
      console.error("Gagal sinkronisasi data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { session: newSession } = await authService.signIn(email, password, supabaseConfig);
      setSession(newSession);
    } catch (e: any) {
      setAuthError(e.message || "Login gagal. Periksa email/password atau konfigurasi database.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.signOut(supabaseConfig);
    setSession(null);
    setVillas([]);
  };

  const handleAddVilla = async (newVilla: Partial<Villa>) => {
    setIsLoading(true);
    try {
      const savedVilla = await villaService.insert(newVilla, supabaseConfig);
      setVillas([savedVilla, ...villas]);
      setActiveTab('list');
    } catch (e: any) {
      alert("Gagal menambah villa: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateVilla = async (updatedData: Partial<Villa>) => {
    if (!editingVilla) return;
    setIsLoading(true);
    try {
      const updated = await villaService.update(editingVilla.id, updatedData, supabaseConfig);
      setVillas(villas.map(v => v.id === editingVilla.id ? updated : v));
      setEditingVilla(null);
      setActiveTab('list');
    } catch (e: any) {
      alert("Gagal update villa: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVilla = async (id: string) => {
    if (!confirm('Hapus villa ini?')) return;
    setIsLoading(true);
    try {
      await villaService.delete(id, supabaseConfig);
      setVillas(villas.filter(v => v.id !== id));
    } catch (e: any) {
      alert("Gagal menghapus: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = (config: SupabaseConfig) => {
    setSupabaseConfig(config);
    localStorage.setItem('supabase_config', JSON.stringify(config));
    window.location.reload(); // Reload untuk re-inisialisasi client
  };

  const filteredVillas = villas.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         v.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || v.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (!session) {
    return (
      <div className="min-h-screen bg-indigo-900 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="bg-indigo-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="text-indigo-600 w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">VillaPro Admin</h1>
            <p className="text-gray-500 mt-2">Sign in with your Supabase account</p>
          </div>

          {authError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle className="shrink-0 w-5 h-5" />
              <p>{authError}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input name="email" type="email" required className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="agent@email.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input name="password" type="password" required className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="••••••••" />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-gray-100">
            <button 
              onClick={() => setActiveTab('database')} 
              className="w-full text-indigo-600 text-sm font-bold hover:underline"
            >
              Database Settings (Setup First)
            </button>
          </div>
        </div>

        {/* Database setup if not logged in */}
        {activeTab === 'database' && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full relative">
              <button onClick={() => setActiveTab('dashboard')} className="absolute top-4 right-4 text-gray-400">✕</button>
              <Settings config={supabaseConfig} onSave={handleSaveSettings} />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
      {activeTab === 'dashboard' && <Dashboard villas={villas} />}
      {activeTab === 'list' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-bold text-gray-900">Villa List</h2>
                {isLoading && <Loader2 size={20} className="animate-spin text-indigo-500" />}
              </div>
              <p className="text-gray-500 mt-1">Logged in as {session.user.email}</p>
            </div>
            <button onClick={() => setActiveTab('add')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg"><Plus size={20} /> Add Villa</button>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Search by name or location..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-100 shadow-sm outline-none bg-white" />
            </div>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-6 py-4 rounded-xl border border-gray-100 shadow-sm bg-white font-medium">
              <option value="All">All Status</option>
              {Object.values(VillaStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {villas.length === 0 && !isLoading ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-400 font-medium">No villas found. Add your first villa!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
              {filteredVillas.map(villa => (
                <VillaCard key={villa.id} villa={villa} onEdit={(v) => { setEditingVilla(v); setActiveTab('edit'); }} onDelete={handleDeleteVilla} />
              ))}
            </div>
          )}
        </div>
      )}
      {activeTab === 'add' && <VillaForm onSubmit={handleAddVilla} onCancel={() => setActiveTab('list')} />}
      {activeTab === 'edit' && editingVilla && <VillaForm initialData={editingVilla} onSubmit={handleUpdateVilla} onCancel={() => { setEditingVilla(null); setActiveTab('list'); }} />}
      {activeTab === 'database' && <Settings config={supabaseConfig} onSave={handleSaveSettings} />}
    </Layout>
  );
};

export default App;
