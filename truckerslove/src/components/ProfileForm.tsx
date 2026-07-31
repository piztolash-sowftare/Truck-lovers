'use client';

import React, { useState } from 'react';
import { updateProfile, uploadProfileImage } from '@/app/actions';
import { MapPin, Save, Truck, Info, Heart, Settings, Camera, User, Calendar, Briefcase, Star } from 'lucide-react';

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
  const [imagePreview, setImagePreview] = useState(user.image || '');

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setLoading(true);
      await uploadProfileImage(base64String);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8">
      {/* Profile Image Section */}
      <div className="flex flex-col items-center">
        <div className="relative group">
          <div className="w-40 h-40 rounded-[2.5rem] bg-slate-900 overflow-hidden border-4 border-slate-800 shadow-2xl flex items-center justify-center relative">
            {imagePreview ? (
              <img src={imagePreview} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-6xl font-black text-red-600">
                {user.name.charAt(0)}
              </span>
            )}
            {loading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <label className="absolute -bottom-2 -right-2 bg-red-600 text-white p-4 rounded-2xl shadow-lg border-4 border-slate-950 cursor-pointer hover:scale-110 transition-all">
            <Camera size={24} />
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-4">Apasă pe cameră pentru a schimba poza</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="space-y-6">
          <h4 className="flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest border-b border-white/5 pb-3">
            <Settings size={16} /> Configurare Radar
          </h4>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block px-1">Vârstă</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                <input 
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-red-600 outline-none text-white font-bold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block px-1">Gen</label>
              <select 
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-white/5 rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-red-600 outline-none text-white font-bold appearance-none"
              >
                <option value="male">Bărbat</option>
                <option value="female">Femeie</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block px-1">Caut</label>
              <select 
                name="lookingFor"
                value={formData.lookingFor}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-white/5 rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-red-600 outline-none text-white font-bold appearance-none"
              >
                <option value="female">Femei</option>
                <option value="male">Bărbați</option>
                <option value="both">Ambele</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block px-1">Rază Căutare (KM)</label>
            <input type="range" min="10" max="1000" defaultValue="500" className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-red-600 border border-white/5" />
            <div className="flex justify-between text-[10px] text-slate-600 font-black">
              <span>10 KM</span>
              <span>1000 KM</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest border-b border-white/5 pb-3">
            <Truck size={16} /> Logistica Traseului
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block px-1">Oraș Plecare</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  name="routeStart"
                  value={formData.routeStart}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-red-600 outline-none text-white font-bold"
                  placeholder="Ex: Oradea"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block px-1">Oraș Destinație</label>
              <div className="relative">
                <Truck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  name="routeEnd"
                  value={formData.routeEnd}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-red-600 outline-none text-white font-bold"
                  placeholder="Ex: Berlin"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block px-1">Camionul tău (Model & Motorizare)</label>
            <div className="relative">
              <Star size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                name="truckModel"
                value={formData.truckModel}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-red-600 outline-none text-white font-bold"
                placeholder="Ex: Scania R500 V8, Volvo FH16 750"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest border-b border-white/5 pb-3">
            <Info size={16} /> Fișa Personală
          </h4>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block px-1">Biografia ta (Ce cauți, cine ești?)</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full bg-slate-900 border border-white/5 rounded-3xl py-4 px-5 text-sm focus:ring-2 focus:ring-red-600 outline-none text-white font-medium leading-relaxed"
              placeholder="Spune-ne povestea ta pe sosea..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block px-1">Ani Experiență</label>
              <div className="relative">
                <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-red-600 outline-none text-white font-bold"
                  placeholder="Ex: 12 ani"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block px-1">Ce faci în pauză?</label>
              <div className="relative">
                <Heart size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  name="hobbies"
                  value={formData.hobbies}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-red-600 outline-none text-white font-bold"
                  placeholder="Ex: Pescuit, Gătit la butelie"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="premium-btn w-full py-5 text-base"
        >
          <Save size={20} />
          {loading ? 'SE SALVEAZĂ DATELE...' : 'ACTUALIZEAZĂ PROFILUL PREMIUM'}
        </button>
      </form>
    </div>
  );
}
