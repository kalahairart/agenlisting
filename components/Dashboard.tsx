
import React from 'react';
import { Villa, Stats, VillaStatus } from '../types';
import { Users, Home, TrendingUp, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  villas: Villa[];
}

const Dashboard: React.FC<DashboardProps> = ({ villas }) => {
  const stats: Stats = {
    totalVillas: villas.length,
    totalPotentialCommission: villas.reduce((sum, v) => sum + v.agent_fee, 0),
    availableCount: villas.filter(v => v.status === VillaStatus.AVAILABLE).length,
    rentedCount: villas.filter(v => v.status === VillaStatus.RENTED).length,
  };

  const chartData = [
    { name: 'Available', value: stats.availableCount, color: '#10b981' },
    { name: 'Rented', value: stats.rentedCount, color: '#3b82f6' },
    { name: 'Maintenance', value: villas.filter(v => v.status === VillaStatus.MAINTENANCE).length, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500 mt-1">Manage your properties and track your earnings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Home className="text-indigo-600" />} label="Total Villas" value={stats.totalVillas.toString()} />
        <StatCard icon={<TrendingUp className="text-emerald-600" />} label="Potential Commission" value={`$${stats.totalPotentialCommission.toLocaleString()}`} />
        <StatCard icon={<Users className="text-blue-600" />} label="Available Units" value={stats.availableCount.toString()} />
        <StatCard icon={<AlertCircle className="text-amber-600" />} label="Maintenance" value={(villas.length - stats.availableCount - stats.rentedCount).toString()} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6">Inventory Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6">Recent Additions</h3>
          <div className="space-y-4">
            {villas.slice(0, 5).map(villa => (
              <div key={villa.id} className="flex items-center gap-4">
                <img src={villa.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{villa.name}</p>
                  <p className="text-xs text-gray-500 truncate">{villa.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-indigo-600">${villa.price_monthly}/mo</p>
                </div>
              </div>
            ))}
            {villas.length === 0 && <p className="text-center text-gray-400 py-10">No villas added yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
    <div className="p-3 bg-gray-50 rounded-xl">{icon}</div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default Dashboard;
