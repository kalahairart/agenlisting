
import React, { useState, useEffect } from 'react';
import { Villa, VillaStatus } from '../types';
import { Sparkles, Loader2, Save, X, Link as LinkIcon } from 'lucide-react';
import { generateVillaDescription } from '../services/geminiService';

interface VillaFormProps {
  onSubmit: (villa: Partial<Villa>) => void;
  onCancel: () => void;
  initialData?: Villa;
}

const VillaForm: React.FC<VillaFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState<Partial<Villa>>({
    name: '',
    image_url: '',
    google_drive_link: '',
    description: '',
    location: '',
    price_monthly: 0,
    price_yearly: 0,
    agent_fee: 0,
    status: VillaStatus.AVAILABLE,
  });

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleMagicDescribe = async () => {
    if (!formData.name || !formData.location || !formData.price_monthly) {
      alert("Please fill in Name, Location, and Monthly Price first!");
      return;
    }
    
    setIsGenerating(true);
    const aiDescription = await generateVillaDescription({
      name: formData.name!,
      location: formData.location!,
      price_monthly: formData.price_monthly!
    });
    setFormData(prev => ({ ...prev, description: aiDescription }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 animate-slideUp max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{initialData ? 'Edit Villa' : 'Add New Villa'}</h2>
          <p className="text-gray-500 text-sm mt-1">Fill in the details below to list your property.</p>
        </div>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-50 rounded-full"><X size={24} /></button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Row 1 */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 ml-1">Villa Name</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
              placeholder="e.g. Villa Samudra Ocean View"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 ml-1">Status</label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as VillaStatus })}
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none bg-white cursor-pointer"
            >
              {Object.values(VillaStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Row 2 */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 ml-1">Image URL</label>
            <input
              required
              type="url"
              value={formData.image_url}
              onChange={e => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 ml-1">Google Drive Link (Docs/Photos)</label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="url"
                value={formData.google_drive_link}
                onChange={e => setFormData({ ...formData, google_drive_link: e.target.value })}
                className="w-full pl-12 pr-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                placeholder="https://drive.google.com/..."
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="space-y-2 md:col-span-2">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-bold text-gray-700 ml-1">Description</label>
              <button
                type="button"
                onClick={handleMagicDescribe}
                disabled={isGenerating}
                className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full transition-all"
              >
                {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {isGenerating ? 'AI Writing...' : 'Write with Gemini AI'}
              </button>
            </div>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
              placeholder="Describe the villa's unique selling points..."
            />
          </div>

          {/* Row 4 */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 ml-1">Location</label>
            <input
              required
              type="text"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
              placeholder="e.g. Canggu, Bali"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 ml-1">Agent Fee / Commission ($)</label>
            <input
              required
              type="number"
              value={formData.agent_fee}
              onChange={e => setFormData({ ...formData, agent_fee: Number(e.target.value) })}
              className="w-full px-5 py-4 rounded-2xl border-indigo-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-emerald-50/30 text-emerald-900 font-bold"
              placeholder="0"
            />
          </div>

          {/* Row 5 */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 ml-1">Monthly Price ($)</label>
            <input
              required
              type="number"
              value={formData.price_monthly}
              onChange={e => setFormData({ ...formData, price_monthly: Number(e.target.value) })}
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700 ml-1">Yearly Price ($)</label>
            <input
              required
              type="number"
              value={formData.price_yearly}
              onChange={e => setFormData({ ...formData, price_yearly: Number(e.target.value) })}
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-6 border-t border-gray-100">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <Save size={20} />
            {initialData ? 'Save Changes' : 'List Property'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-8 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold py-4 rounded-2xl transition-all active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default VillaForm;
