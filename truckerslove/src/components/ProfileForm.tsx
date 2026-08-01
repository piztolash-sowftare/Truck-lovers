'use client';

import React, { useState } from 'react';
import { updateFullProfile } from '@/app/actions';
import { MapPin, Save, Truck, Info, Heart, Settings, Camera, Calendar, Briefcase, Star, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logoutAction } from '@/app/actions/auth';

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
      alert('Profil salvat cu succes!');
    } catch (err) {
      alert('Eroare: Pozele sunt probabil prea mari. Încearcă fișiere sub 1MB.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [...gallery];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 1024 * 1024) {
        alert(`Fișierul ${file.name} este prea mare. Maxim 1MB per imagine.`);
        continue;
      }
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newImages.push(base64);
    }
    setGallery(newImages.slice(0, 6));
  };

  const removePhoto = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Camera size={14} /> Galerie (max. 6)
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <AnimatePresence>
            {gallery.map((img, idx) => (
              <motion.div key={idx} layout initial={{scale:0}} animate={{scale:1}} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                <img src={img} className="w-full h-full object-cover" />
                <button onClick={() => removePhoto(idx)} className="absolute top-1 right-1 bg-white/80 p-1.5 rounded-lg text-red-500 shadow-sm"><X size={12} /></button>
              </motion.div>
            ))}
          </AnimatePresence>
          {gallery.length < 6 && (
            <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer transition-colors">
              <Camera size={20} />
              <input type="file" hidden multiple accept="image/*" onChange={handleFileChange} />
            </label>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Settings size={14} /> Preferințe
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 font-bold ml-1">Vârstă</span>
              <input name="age" type="number" value={formData.age} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-xl py-2 px-3 text-sm font-semibold" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 font-bold ml-1">Eu sunt</span>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-xl py-2 px-3 text-sm font-semibold">
                <option value="male">Bărbat</option>
                <option value="female">Femeie</option>
              </select>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 font-bold ml-1">Caut</span>
              <select name="lookingFor" value={formData.lookingFor} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-xl py-2 px-3 text-sm font-semibold">
                <option value="female">Femei</option>
                <option value="male">Bărbați</option>
                <option value="both">Ambele</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Truck size={14} /> Logistică
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <input name="routeStart" value={formData.routeStart} onChange={handleChange} placeholder="Plec din..." className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm" />
            <input name="routeEnd" value={formData.routeEnd} onChange={handleChange} placeholder="Merg spre..." className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm" />
          </div>
          <input name="truckModel" value={formData.truckModel} onChange={handleChange} placeholder="Modelul camionului tău" className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm" />
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Info size={14} /> Biografie
          </h3>
          <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} placeholder="Spune ceva despre tine..." className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 text-sm resize-none" />
          <div className="grid grid-cols-2 gap-3">
            <input name="experience" value={formData.experience} onChange={handleChange} placeholder="Ani exp." className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm" />
            <input name="hobbies" value={formData.hobbies} onChange={handleChange} placeholder="Hobby-uri" className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 text-sm" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full btn-boo py-5 rounded-3xl text-sm font-black shadow-xl shadow-violet-200">
          {loading ? 'SALVARE...' : 'SALVEAZĂ PROFILUL'}
        </button>

        <button onClick={() => logoutAction()} type="button" className="w-full py-4 text-xs font-bold text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest">
           Ieșire din Cont
        </button>
      </form>
    </div>
  );
}
