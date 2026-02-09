
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import VillaCard from './components/VillaCard';
import VillaForm from './components/VillaForm';
import Settings from './components/Settings';
import { Villa, VillaStatus, SupabaseConfig } from './types';
import { Search, Plus, Filter, LogIn, Lock, Mail, Loader2 } from 'lucide-react';
import { villaService } from './services/villaService';

const INITIAL_VILLAS: Villa[] = [
  {
    id: '1',
    name: 'Sunset Paradise Villa',
    image_url: 'https://images.unsplash.com/photo-1580587771525-78b9bed3b904?auto=format&fit=crop&q=80&w=1074',
    google_drive_link: 'https://drive.google.com',
    description: 'Breathtaking ocean views with infinity pool.',
    location: 'Uluwatu, Bali',
    price_monthly: 4500,
    price_yearly: 48000,
    agent_fee: 1200,
    status: VillaStatus.AVAILABLE,
  }
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig | null>(() => {
    const saved = localStorage.getItem('supabase_config');
    return saved ? JSON.parse(saved) : null;
  });

  const [villas, setVillas] = useState<Villa[]>(() => {
    const saved = localStorage.getItem('villas');
    return saved ? JSON.parse(saved) : INITIAL_VILLAS;
  });

  const [editingVilla, setEditingVilla] = useState<Villa | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Sync data dari database
  const syncData = async () => {
    if (!supabaseConfig) return;
    setIsLoading(true);
    try {
      const data = await villaService.fetchAll(supabaseConfig);
      setVillas(data);
      localStorage.setItem('villas', JSON.stringify(data));
    } catch (e) {
      console.error("Gagal sinkronisasi data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (supabaseConfig) {
      syncData();
    }
  }, [supabaseConfig]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  const handleAddVilla = async (newVilla: Partial<Villa>) => {
    setIsLoading(true);
    try {
      if (supabaseConfig) {
        const savedVilla = await villaService.insert(newVilla, supabaseConfig);
        setVillas([savedVilla, ...villas]);
      } else {
        const localVilla = { ...newVilla, id: Date.now().toString() } as Villa;
        setVillas([localVilla, ...villas]);
      }
      setActiveTab('list');
    } catch (e) {
      alert("Gagal menambah villa: " + (e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateVilla = async (updatedData: Partial<Villa>) => {
    if (!editingVilla) return;
    setIsLoading(true);
    try {
      if (supabaseConfig) {
        const updated = await villaService.update(editingVilla.id, updatedData, supabaseConfig);
        setVillas(villas.map(v => v.id === editingVilla.id ? updated : v));
      } else {
        setVillas(villas.map(v => v.id === editingVilla.id ? { ...v, ...updatedData } : v));
      }
      setEditingVilla(null);
      setActiveTab('list');
    } catch (e) {
      alert("Gagal update villa: " + (e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVilla = async (id: string) => {
    if (!confirm('Hapus villa ini?')) return;
    setIsLoading(true);
    try {
      if (supabaseConfig) {
        await villaService.delete(id, supabaseConfig);
      }
      setVillas(villas.filter(v => v.id !== id));
    } catch (e) {
      alert("Gagal menghapus: " + (e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = (config: SupabaseConfig) => {
    setSupabaseConfig(config);
    localStorage.setItem('supabase_config', JSON.stringify(config));
  };

  const filteredVillas = villas.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         v.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || v.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="bg-indigo-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="text-indigo-600 w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">VillaPro Admin</h1>
            <p className="text-gray-500 mt-2">Sign in to manage your villa catalog</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="email" required defaultValue="agent@villapro.com" className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="password" required defaultValue="password" className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-200 transition-all">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => setIsAuthenticated(false)}>
      {activeTab === 'dashboard' && <Dashboard villas={villas} />}
      {activeTab === 'list' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-bold text-gray-900">Villa List</h2>
                {isLoading && <Loader2 size={20} className="animate-spin text-indigo-500" />}
              </div>
              <p className="text-gray-500 mt-1">{supabaseConfig ? 'Cloud Sync Enabled' : 'Local Storage Mode'}</p>
            </div>
            <button onClick={() => setActiveTab('add')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg"><Plus size={20} /> Add Villa</button>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-100 shadow-sm outline-none bg-white" />
            </div>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-6 py-4 rounded-xl border border-gray-100 shadow-sm bg-white font-medium">
              <option value="All">All Status</option>
              {Object.values(VillaStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {filteredVillas.map(villa => (
              <VillaCard key={villa.id} villa={villa} onEdit={(v) => { setEditingVilla(v); setActiveTab('edit'); }} onDelete={handleDeleteVilla} />
            ))}
          </div>
        </div>
      )}
      {activeTab === 'add' && <VillaForm onSubmit={handleAddVilla} onCancel={() => setActiveTab('list')} />}
      {activeTab === 'edit' && editingVilla && <VillaForm initialData={editingVilla} onSubmit={handleUpdateVilla} onCancel={() => { setEditingVilla(null); setActiveTab('list'); }} />}
      {activeTab === 'database' && <Settings config={supabaseConfig} onSave={handleSaveSettings} />}
    </Layout>
  );
};

export default App;
