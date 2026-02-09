
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import VillaCard from './components/VillaCard';
import VillaForm from './components/VillaForm';
import Settings from './components/Settings';
import { Villa, VillaStatus, SupabaseConfig } from './types';
import { Search, Plus, Filter, LogIn, Lock, Mail, Loader2 } from 'lucide-react';
import { getSupabase } from './lib/supabase';

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
  },
  {
    id: '2',
    name: 'Jungle Retreat Ubud',
    image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1170',
    google_drive_link: 'https://drive.google.com',
    description: 'Serene jungle atmosphere with traditional Balinese architecture.',
    location: 'Ubud, Bali',
    price_monthly: 3200,
    price_yearly: 35000,
    agent_fee: 900,
    status: VillaStatus.RENTED,
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

  // Fetch from Supabase if configured
  const syncWithSupabase = async (config: SupabaseConfig | null) => {
    if (!config) return;
    const supabase = getSupabase(config);
    if (!supabase) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('villas').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) {
        setVillas(data);
        localStorage.setItem('villas', JSON.stringify(data));
      }
    } catch (e) {
      console.error("Supabase sync error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (supabaseConfig) {
      syncWithSupabase(supabaseConfig);
    }
  }, [supabaseConfig]);

  useEffect(() => {
    localStorage.setItem('villas', JSON.stringify(villas));
  }, [villas]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  const saveToSupabase = async (villa: Villa | Partial<Villa>, method: 'INSERT' | 'UPDATE' | 'DELETE') => {
    if (!supabaseConfig) return;
    const supabase = getSupabase(supabaseConfig);
    if (!supabase) return;

    try {
      if (method === 'INSERT') {
        await supabase.from('villas').insert([villa]);
      } else if (method === 'UPDATE') {
        await supabase.from('villas').update(villa).eq('id', villa.id);
      } else if (method === 'DELETE') {
        await supabase.from('villas').delete().eq('id', villa.id);
      }
    } catch (e) {
      console.error("Supabase write error:", e);
    }
  };

  const handleAddVilla = async (newVilla: Partial<Villa>) => {
    const villaWithId = { ...newVilla, id: Date.now().toString() } as Villa;
    setVillas([villaWithId, ...villas]);
    setActiveTab('list');
    await saveToSupabase(villaWithId, 'INSERT');
  };

  const handleUpdateVilla = async (updatedData: Partial<Villa>) => {
    if (!editingVilla) return;
    const updatedVilla = { ...editingVilla, ...updatedData };
    setVillas(villas.map(v => v.id === editingVilla.id ? updatedVilla : v));
    setEditingVilla(null);
    setActiveTab('list');
    await saveToSupabase(updatedVilla, 'UPDATE');
  };

  const handleDeleteVilla = async (id: string) => {
    if (confirm('Are you sure you want to delete this villa?')) {
      const deletedVilla = villas.find(v => v.id === id);
      setVillas(villas.filter(v => v.id !== id));
      if (deletedVilla) {
        await saveToSupabase(deletedVilla, 'DELETE');
      }
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
              <label className="block text-sm font-semibold text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  defaultValue="agent@villapro.com"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  required
                  defaultValue="password"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-200 transition-all">
              Sign In Now
            </button>
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
                <h2 className="text-3xl font-bold text-gray-900">Your Properties</h2>
                {isLoading && <Loader2 size={20} className="animate-spin text-indigo-500" />}
              </div>
              <p className="text-gray-500 mt-1">
                {supabaseConfig ? 'Connected to Supabase Cloud' : 'Using Local Storage (Unconnected)'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('add')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg"
            >
              <Plus size={20} /> Add Villa
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-100 shadow-sm outline-none bg-white transition-all"
              />
            </div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-6 py-4 rounded-xl border border-gray-100 shadow-sm outline-none bg-white font-medium"
            >
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
