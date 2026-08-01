'use client';

import React, { useState } from 'react';
import { updateFullProfile } from '@/app/actions';
import { MapPin, Save, Truck, Info, Heart, Settings, Camera, User, Calendar, Briefcase, Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      alert('PROFIL ELITE ACTUALIZAT!');
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
    <div className="space-y-12 w-full animate-slide-up">
      {/* 1 Million Dollar Gallery */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h4 className="text-white font-black text-[11px] uppercase tracking-[0.3em]">Garaj Media</h4>
           <span className="text-[10px] font-bold text-zinc-500">{gallery.length} / 6 unități</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {gallery.map((img, idx) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                key={idx} 
                className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/5 bg-zinc-900 group shadow-2xl"
              >
                <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <button 
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="absolute top-2 right-2 bg-black/80 backdrop-blur-md text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-[#ff003c]"
                >
                  <X size={16} strokeWidth={3} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {gallery.length < 6 && (
            <label className="aspect-[3/4] rounded-3xl border-2 border-white/[0.03] border-dashed flex flex-col items-center justify-center text-zinc-600 hover:text-[#ff003c] hover:border-[#ff003c]/30 hover:bg-[#ff003c]/5 transition-all cursor-pointer bg-[#050505] group">
               <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Camera size={24} strokeWidth={1.5} />
               </div>
               <span className="text-[9px] font-black uppercase tracking-widest">Adaugă</span>
               <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} />
            </label>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-12">
        {/* Basic Info Bento */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1 flex flex-col gap-2">
             <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest px-1">Vârstă</label>
             <input name="age" type="number" value={formData.age} onChange={handleChange} className="input-obsidian !py-3 !px-4 !text-center" />
          </div>
          <div className="col-span-1 flex flex-col gap-2">
             <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest px-1">Sunt</label>
             <select name="gender" value={formData.gender} onChange={handleChange} className="input-obsidian !py-3 !px-4 !text-center appearance-none">
                <option value="male">M</option>
                <option value="female">F</option>
             </select>
          </div>
          <div className="col-span-1 flex flex-col gap-2">
             <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest px-1">Caut</label>
             <select name="lookingFor" value={formData.lookingFor} onChange={handleChange} className="input-obsidian !py-3 !px-4 !text-center appearance-none">
                <option value="female">F</option>
                <option value="male">M</option>
                <option value="both">All</option>
             </select>
          </div>
        </div>

        {/* Route Section */}
        <div className="obsidian-panel p-8 rounded-[3rem] space-y-8">
           <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-[#ff003c] rounded-full shadow-[0_0_15px_rgba(255,0,60,0.5)]" />
              <h3 className="text-xs font-black text-white uppercase tracking-[0.4em]">Logistica</h3>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <input name="routeStart" value={formData.routeStart} onChange={handleChange} className="input-obsidian text-xs" placeholder="Plecare" />
              <input name="routeEnd" value={formData.routeEnd} onChange={handleChange} className="input-obsidian text-xs" placeholder="Destinație" />
           </div>
           
           <input name="truckModel" value={formData.truckModel} onChange={handleChange} className="input-obsidian w-full text-xs" placeholder="Model Camion (ex: Volvo 750)" />
        </div>

        {/* Bio Section */}
        <div className="obsidian-panel p-8 rounded-[3rem] space-y-8">
           <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-[#ff003c] rounded-full shadow-[0_0_15px_rgba(255,0,60,0.5)]" />
              <h3 className="text-xs font-black text-white uppercase tracking-[0.4em]">Biografia</h3>
           </div>
           <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="input-obsidian w-full text-xs resize-none" placeholder="Cine ești la volan?" />
           
           <div className="grid grid-cols-2 gap-4">
              <input name="experience" value={formData.experience} onChange={handleChange} className="input-obsidian text-xs" placeholder="Exp (ani)" />
              <input name="hobbies" value={formData.hobbies} onChange={handleChange} className="input-obsidian text-xs" placeholder="Hobby-uri" />
           </div>
        </div>

        <button type="submit" disabled={loading} className="btn-premium w-full !bg-[#ff003c] !text-white !py-6 shadow-[0_15px_40px_rgba(255,0,60,0.3)] border-none">
           {loading ? 'Transmițând...' : 'SALVEAZĂ PROFILUL ELITE'}
        </button>
      </form>
    </div>
  );
}
