'use client';

import React, { useState } from 'react';
import { updateProfile, uploadProfileImages } from '@/app/actions';
import { MapPin, Save, Truck, Info, Heart, Settings, Camera, User, Calendar, Briefcase, Star, X } from 'lucide-react';

import { updateFullProfile } from '@/app/actions';

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
  const [gallery, setGallery] = useState<string[]>(() => {
    try {
      return user.images ? JSON.parse(user.images) : user.image ? [user.image] : [];
    } catch (e) {
      return user.image ? [user.image] : [];
    }
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateFullProfile({ ...formData, images: gallery });
      alert('Profil actualizat cu succes, colegule!');
    } catch (err) {
      alert('Eroare la actualizare. Verifica marimea pozelor.');
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [...gallery];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Basic size check for Base64 (Neon has limits)
      if (file.size > 500000) {
        alert('Poza este prea mare! Max 500KB per poza.');
        continue;
      }
      
      const reader = new FileReader();
      const promise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const base64 = await promise;
      newImages.push(base64);
    }

    setGallery(newImages.slice(0, 6));
  };

  const removePhoto = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-12 w-full">
      {/* 1 Million Dollar Gallery */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
           <h4 className="text-red-500 font-black text-[10px] uppercase tracking-[0.4em]">Garajul Foto Premium</h4>
           <span className="text-[10px] font-black text-slate-700">{gallery.length}/6</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {gallery.map((img, idx) => (
            <div key={idx} className="relative group aspect-[3/4] rounded-3xl overflow-hidden border border-white/5 bg-[#050505] shadow-xl">
              <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <button 
                type="button"
                onClick={() => removePhoto(idx)}
                className="absolute top-2 right-2 bg-black/80 backdrop-blur-md text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 scale-75 group-hover:scale-100"
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>
          ))}
          {gallery.length < 6 && (
            <label className="aspect-[3/4] rounded-3xl border border-white/10 border-dashed flex flex-col items-center justify-center text-slate-800 hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/[0.02] transition-all cursor-pointer bg-black/40 group">
               <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Camera size={24} />
               </div>
               <span className="text-[9px] font-black uppercase tracking-widest">Adaugă</span>
               <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} />
            </label>
          )}
        </div>
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
