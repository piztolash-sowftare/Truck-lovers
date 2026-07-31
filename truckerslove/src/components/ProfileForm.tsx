'use client';

import React, { useState } from 'react';
import { updateProfile, uploadProfileImage } from '@/app/actions';
import { MapPin, Save, Truck, Info, Heart, Settings, Camera } from 'lucide-react';

export default function ProfileForm({ user }: { user: any }) {
  const [formData, setFormData] = useState({
    routeStart: user.routeStart || '',
    routeEnd: user.routeEnd || '',
    bio: user.bio || '',
    truckModel: user.truckModel || '',
    experience: user.experience || '',
    hobbies: user.hobbies || '',
    gender: user.gender || 'male',
    lookingFor: user.lookingFor || 'female',
    age: user.age || 28,
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await updateProfile(formData);
    setLoading(false);
    alert('Profil actualizat cu succes, colegule!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMockUpload = async () => {
    setLoading(true);
    await uploadProfileImage();
    setLoading(false);
    alert('Poză actualizată!');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-red-600 font-bold text-sm border-b border-red-100 pb-2">
          <Settings size={16} /> Preferințe Căutare
        </h4>
        
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Vârstă</label>
            <input 
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Eu sunt</label>
            <select 
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value="male">Bărbat</option>
              <option value="female">Femeie</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Caut</label>
            <select 
              name="lookingFor"
              value={formData.lookingFor}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value="female">Femei</option>
              <option value="male">Bărbați</option>
              <option value="both">Ambele</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Distanță (KM)</label>
          <input type="range" min="10" max="1000" defaultValue="500" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600" />
          <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-1">
            <span>10 KM</span>
            <span>1000 KM</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-red-600 font-bold text-sm border-b border-red-100 pb-2">
          <Truck size={16} /> Detalii Rută & Camion
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">De la</label>
            <input
              name="routeStart"
              value={formData.routeStart}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="Oradea"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Până la</label>
            <input
              name="routeEnd"
              value={formData.routeEnd}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="Varșovia"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Ce camion conduci?</label>
          <input
            name="truckModel"
            value={formData.truckModel}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
            placeholder="Ex: Scania R500 V8, Volvo FH16"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="flex items-center gap-2 text-red-600 font-bold text-sm border-b border-red-100 pb-2">
          <Info size={16} /> Despre Tine
        </h4>
        
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Descriere</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
            placeholder="Spune ceva despre tine..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Experiență (ani)</label>
            <input
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="Ex: 10 ani"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Hobby-uri</label>
            <input
              name="hobbies"
              value={formData.hobbies}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="Pescuit, Gătit..."
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-lg active:scale-95 disabled:opacity-50"
      >
        <Save size={20} />
        {loading ? 'SE SALVEAZĂ...' : 'SALVEAZĂ PROFILUL'}
      </button>
    </form>
  );
}
