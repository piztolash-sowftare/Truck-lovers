'use client';

import { useState } from 'react';
import { Truck, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { register, loginAction } from '@/app/actions/auth';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    try {
      const result = mode === 'login' ? await loginAction(formData) : await register(formData);
      
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
    } catch (e) {
      setError('A apărut o eroare neașteptată. Te rugăm să verifici conexiunea.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-slate-950 flex flex-col relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-red-600/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 -right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />

      <div className="flex-1 flex flex-col items-center justify-center px-8 z-10">
        <div className="bg-red-600 p-4 rounded-3xl mb-6 shadow-2xl shadow-red-600/20">
          <Truck className="text-white" size={48} />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tighter mb-2">TRUCKLOVERS</h1>
        <p className="text-slate-400 text-center text-xs mb-8 font-bold uppercase tracking-widest">
          {mode === 'login' ? 'Bine ai revenit, colega!' : 'Alătură-te frăției șoselelor'}
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-xs font-bold text-center">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                name="name"
                type="text"
                required
                placeholder="Nume Complet"
                className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition-all text-sm"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              name="email"
              type="email"
              required
              placeholder="Email"
              className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition-all text-sm"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              name="password"
              type="password"
              required
              placeholder="Parolă"
              className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition-all text-sm"
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? 'SE PROCESEAZĂ...' : mode === 'login' ? 'INTRĂ ÎN CONT' : 'CREEAZĂ CONT'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="flex items-center gap-4 py-6 w-full">
          <div className="h-px bg-slate-800 flex-1" />
          <span className="text-slate-500 text-[10px] font-black uppercase">Sau continuă cu</span>
          <div className="h-px bg-slate-800 flex-1" />
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <button 
            type="button"
            onClick={async () => {
              setLoading(true);
              setError('Autentificarea socială necesită configurarea API-ului în Vercel. Folosește Email pentru moment.');
              setLoading(false);
            }}
            className="bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 border border-white/10 transition-all text-xs"
          >
            <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center text-[8px] font-black text-white">f</div>
            Facebook
          </button>
          <button 
            type="button"
            onClick={async () => {
              setLoading(true);
              setError('Autentificarea socială necesită configurarea API-ului în Vercel. Folosește Email pentru moment.');
              setLoading(false);
            }}
            className="bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 border border-white/10 transition-all text-xs"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
            Google
          </button>
        </div>

        <button 
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="mt-8 text-slate-400 text-xs font-bold hover:text-white transition-colors"
        >
          {mode === 'login' ? 'Nu ai cont? Înregistrează-te acum' : 'Ai deja cont? Loghează-te'}
        </button>
      </div>

      <div className="p-8 text-center z-10">
        <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em]">
          Premium Experience by Piztolash
        </p>
      </div>
    </div>
  );
}
