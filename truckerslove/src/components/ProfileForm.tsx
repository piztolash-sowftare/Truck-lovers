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
      const res = await updateFullProfile({ ...formData, images: gallery });
      if (res?.error) {
        alert("Eroare: " + res.error);
      } else {
        alert('PROFIL ACTUALIZAT!');
      }
    } catch (err) {
      alert('Eroare neașteptată.');
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
    <div className="space-y-10 w-full animate-slide-up">
      {/* Gallery Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h4 className="text-red-500 font-black text-xs uppercase tracking-[0.3em]">Garajul Foto</h4>
           <span className="text-xs font-bold text-zinc-500">{gallery.length}/6</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {gallery.map((img, idx) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                key={idx} 
                className="relative aspect-square rounded-2xl overflow-hidden border border-white/5 bg-zinc-900 group shadow-xl"
              >
                <img src={img} className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="absolute top-1 right-1 bg-black/60 backdrop-blur-md text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                >
                  <X size={14} strokeWidth={3} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {gallery.length < 6 && (
            <label className="aspect-square rounded-2xl border-2 border-white/[0.05] border-dashed flex flex-col items-center justify-center text-zinc-600 hover:text-red-500 hover:border-red-500/30 transition-all cursor-pointer bg-white/5">
               <Camera size={24} />
               <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} />
            </label>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Vârstă</label>
            <input name="age" type="number" value={formData.age} onChange={handleChange} className="w-full bg-slate-900 border border-white/5 rounded-xl py-3 px-4 text-sm text-white font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Eu sunt</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-900 border border-white/5 rounded-xl py-3 px-4 text-sm text-white font-bold appearance-none">
                <option value="male">Bărbat</option>
                <option value="female">Femeie</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Caut</label>
            <select name="lookingFor" value={formData.lookingFor} onChange={handleChange} className="w-full bg-slate-900 border border-white/5 rounded-xl py-3 px-4 text-sm text-white font-bold appearance-none">
                <option value="female">Femei</option>
                <option value="male">Bărbați</option>
                <option value="both">Ambele</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input name="routeStart" value={formData.routeStart} onChange={handleChange} placeholder="Plec din..." className="w-full bg-slate-900 border border-white/5 rounded-xl py-4 px-5 text-sm text-white font-bold" />
            <input name="routeEnd" value={formData.routeEnd} onChange={handleChange} placeholder="Merg spre..." className="w-full bg-slate-900 border border-white/5 rounded-xl py-4 px-5 text-sm text-white font-bold" />
          </div>
          <input name="truckModel" value={formData.truckModel} onChange={handleChange} placeholder="Modelul camionului tău" className="w-full bg-slate-900 border border-white/5 rounded-xl py-4 px-5 text-sm text-white font-bold" />
          <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} placeholder="Spune ceva despre tine..." className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 px-5 text-sm text-white font-medium resize-none" />
        </div>

        <button type="submit" disabled={loading} className="btn-elite w-full py-5 text-sm shadow-red-600/40 border-none">
          {loading ? 'SE SALVEAZĂ...' : 'SALVEAZĂ PROFILUL'}
        </button>
      </form>
    </div>
  );
}
