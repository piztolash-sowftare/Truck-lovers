'use client';

import { useAuth } from './AuthProvider';
import MobileNav from './MobileNav';
import { Truck, LogIn, Mail } from 'lucide-react';
import { useState } from 'react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, login, isLoading } = useAuth();
  const [email, setEmail] = useState('');

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Truck className="text-red-600 animate-bounce" size={48} />
          <p className="text-white font-black tracking-widest animate-pulse">TRUCKLOVERS</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto h-screen bg-slate-950 flex flex-col relative overflow-hidden">
        {/* Background Decorative Circles */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-red-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />

        <div className="flex-1 flex flex-col items-center justify-center px-8 z-10">
          <div className="bg-red-600 p-4 rounded-3xl mb-6 shadow-2xl shadow-red-600/20">
            <Truck className="text-white" size={64} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">TRUCKLOVERS</h1>
          <p className="text-slate-400 text-center text-sm mb-12 font-medium">
            Cea mai mare comunitate de dating pentru șoferi profesioniști. Înscrie-te și găsește-ți perechea pe traseu!
          </p>

          <div className="w-full space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                type="email"
                placeholder="Introdu email-ul tău"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition-all"
              />
            </div>
            
            <button 
              onClick={() => login(email || 'demo@trucklovers.ro')}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              CONTINUĂ CU EMAIL
            </button>

            <div className="flex items-center gap-4 py-4">
              <div className="h-px bg-slate-800 flex-1" />
              <span className="text-slate-500 text-xs font-bold uppercase">Sau</span>
              <div className="h-px bg-slate-800 flex-1" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 border border-white/10 transition-all">
                <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-[10px] font-black">f</div>
                Facebook
              </button>
              <button className="bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 border border-white/10 transition-all">
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                Google
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 text-center z-10">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            Premium Experience by Piztolash
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto h-screen relative bg-slate-950 flex flex-col overflow-hidden shadow-2xl">
      <header className="flex-none bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          <div className="bg-red-600 p-1.5 rounded-lg">
            <Truck className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-black text-white tracking-tighter">TRUCKLOVERS</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
             <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Premium</span>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">by piztolash</span>
          </div>
          <div className="w-8 h-8 rounded-full border-2 border-red-600/30 overflow-hidden bg-slate-800">
            {user.image ? <img src={user.image} alt="User" /> : <div className="w-full h-full flex items-center justify-center text-xs font-black text-red-500">{user.name[0]}</div>}
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
