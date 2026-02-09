
import React from 'react';
import { Home, List, PlusCircle, LogOut, LayoutDashboard, Database } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'list', label: 'Villa List', icon: List },
    { id: 'add', label: 'Add Villa', icon: PlusCircle },
    { id: 'database', label: 'Database', icon: Database },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Home className="w-8 h-8 text-emerald-400" />
            <span>VillaPro</span>
          </h1>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:bg-indigo-800'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-indigo-200 hover:bg-indigo-800 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-8">
        {/* Mobile Header */}
        <header className="md:hidden bg-indigo-900 text-white p-4 flex justify-between items-center sticky top-0 z-50">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Home className="w-6 h-6 text-emerald-400" />
            <span>VillaPro</span>
          </h1>
          <button onClick={onLogout}><LogOut size={20} /></button>
        </header>

        {/* Dynamic Content */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 w-full bg-white border-t flex justify-around py-3 px-4 z-50">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 ${
                activeTab === item.id ? 'text-indigo-600' : 'text-gray-400'
              }`}
            >
              <item.icon size={24} />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
};

export default Layout;
