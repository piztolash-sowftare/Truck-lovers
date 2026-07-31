'use client';

import { useState } from 'react';
import { Truck, Mail, Lock, User, ArrowRight, KeyRound } from 'lucide-react';
import { register, loginAction } from '@/app/actions/auth';
import { forgotPasswordAction } from '@/app/actions';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    const formData = new FormData(e.currentTarget);
    
    try {
      if (mode === 'forgot') {
        const email = formData.get('email') as string;
        const result = await forgotPasswordAction(email);
        if (result.error) setError(result.error);
        else setSuccess(result.success || 'Email trimis!');
      } else {
        const result = mode === 'login' ? await loginAction(formData) : await register(formData);
        if (result?.error) setError(result.error);
      }
    } catch (e) {
      setError('A apărut o eroare neașteptată. Te rugăm să verifici conexiunea.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-slate-950 flex flex-col relative overflow-hidden font-sans">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/10 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 -right-40 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px]" />

      <div className="flex-1 flex flex-col items-center justify-center px-10 z-10">
        <div className="bg-gradient-to-br from-red-600 to-red-800 p-5 rounded-[2rem] mb-8 shadow-2xl shadow-red-600/30 rotate-3 transform hover:rotate-0 transition-transform duration-500">
          <Truck className="text-white" size={60} />
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-white tracking-tighter italic">TRUCK<span className="text-red-600">LOVERS</span></h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.6em] mt-2">Premium Dating Experience</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-[11px] font-black text-center uppercase tracking-wider">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-2xl text-[11px] font-black text-center uppercase tracking-wider">
              {success}
            </div>
          )}

          {mode === 'register' && (
            <div className="group relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-red-500 transition-colors" size={20} />
              <input 
                name="name"
                type="text"
                required
                placeholder="Nume Complet"
                className="w-full bg-slate-900/50 border border-white/5 rounded-[1.25rem] py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition-all text-sm font-bold placeholder:text-slate-700"
              />
            </div>
          )}

          <div className="group relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-red-500 transition-colors" size={20} />
            <input 
              name="email"
              type="email"
              required
              placeholder="Email"
              className="w-full bg-slate-900/50 border border-white/5 rounded-[1.25rem] py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition-all text-sm font-bold placeholder:text-slate-700"
            />
          </div>

          {mode !== 'forgot' && (
            <div className="group relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-red-500 transition-colors" size={20} />
              <input 
                name="password"
                type="password"
                required
                placeholder="Parolă"
                className="w-full bg-slate-900/50 border border-white/5 rounded-[1.25rem] py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-red-600 outline-none transition-all text-sm font-bold placeholder:text-slate-700"
              />
            </div>
          )}
          
          {mode === 'login' && (
            <div className="flex justify-end px-1">
              <button 
                type="button" 
                onClick={() => setMode('forgot')}
                className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-red-500 transition-colors"
              >
                Am uitat parola?
              </button>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-5 rounded-[1.25rem] shadow-2xl shadow-red-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-sm tracking-widest uppercase"
          >
            {loading ? 'SE PROCESEAZĂ...' : 
             mode === 'login' ? 'Intră în Cont' : 
             mode === 'register' ? 'Creează Cont' : 'Resetează Parola'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="flex items-center gap-6 py-8 w-full opacity-30">
          <div className="h-px bg-slate-700 flex-1" />
          <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Social</span>
          <div className="h-px bg-slate-700 flex-1" />
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <button 
            type="button"
            className="bg-slate-900/50 hover:bg-slate-900 text-white font-black py-4 rounded-[1.25rem] flex items-center justify-center gap-2 border border-white/5 transition-all text-[10px] uppercase tracking-widest"
          >
            <div className="w-5 h-5 bg-blue-600 rounded-lg flex items-center justify-center text-[10px] font-black text-white">f</div>
            Facebook
          </button>
          <button 
            type="button"
            className="bg-slate-900/50 hover:bg-slate-900 text-white font-black py-4 rounded-[1.25rem] flex items-center justify-center gap-2 border border-white/5 transition-all text-[10px] uppercase tracking-widest"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
            Google
          </button>
        </div>

        <button 
          onClick={() => {
            setError('');
            setSuccess('');
            setMode(mode === 'login' ? 'register' : 'login');
          }}
          className="mt-10 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors border-b border-transparent hover:border-red-600 pb-1"
        >
          {mode === 'login' ? 'Nu ai cont? Înscrie-te' : 'Ai deja cont? Loghează-te'}
        </button>

        {mode === 'forgot' && (
          <button 
            onClick={() => {
              setError('');
              setSuccess('');
              setMode('login');
            }}
            className="mt-4 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors"
          >
            Înapoi la Login
          </button>
        )}
      </div>

      <div className="p-8 text-center z-10 border-t border-white/5 w-full bg-slate-950/50 backdrop-blur-md">
        <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.6em]">
          Premium Experience by Piztolash
        </p>
      </div>
    </div>
  );
}
