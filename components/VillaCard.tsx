
import React from 'react';
import { MapPin, Link as LinkIcon, Briefcase, Trash2, Edit2, ExternalLink } from 'lucide-react';
import { Villa, VillaStatus } from '../types';

interface VillaCardProps {
  villa: Villa;
  onEdit: (villa: Villa) => void;
  onDelete: (id: string) => void;
}

const VillaCard: React.FC<VillaCardProps> = ({ villa, onEdit, onDelete }) => {
  const getStatusColor = (status: VillaStatus) => {
    switch (status) {
      case VillaStatus.AVAILABLE: return 'bg-emerald-100 text-emerald-700';
      case VillaStatus.RENTED: return 'bg-blue-100 text-blue-700';
      case VillaStatus.MAINTENANCE: return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-56 overflow-hidden">
        <img
          src={villa.image_url || 'https://picsum.photos/seed/villa/800/400'}
          alt={villa.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${getStatusColor(villa.status)}`}>
          {villa.status}
        </div>
        {villa.google_drive_link && (
          <a
            href={villa.google_drive_link}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all transform hover:scale-110"
            title="Open Drive Folder"
          >
            <LinkIcon size={16} className="text-blue-600" />
          </a>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">{villa.name}</h3>
          <div className="flex gap-1">
            <button onClick={() => onEdit(villa)} className="text-gray-400 hover:text-indigo-600 p-2 hover:bg-indigo-50 rounded-lg transition-all">
              <Edit2 size={18} />
            </button>
            <button onClick={() => onDelete(villa.id)} className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-5">
          <MapPin size={14} className="text-indigo-500" />
          <span className="line-clamp-1 font-medium">{villa.location}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Monthly</p>
            <p className="text-base font-bold text-gray-900">${villa.price_monthly.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Yearly</p>
            <p className="text-base font-bold text-gray-900">${villa.price_yearly.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-gray-100">
          <div className="flex items-center gap-2 text-emerald-600">
            <div className="p-1.5 bg-emerald-50 rounded-lg">
              <Briefcase size={16} />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Agency Fee</p>
              <p className="text-sm font-bold">${villa.agent_fee.toLocaleString()}</p>
            </div>
          </div>
          
          {villa.google_drive_link && (
            <a 
              href={villa.google_drive_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
            >
              Docs <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default VillaCard;
