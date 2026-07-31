'use client';

import { useState } from 'react';
import { Truck, Mail, Lock, User, ArrowRight, KeyRound } from 'lucide-react';
import { register, loginAction } from '@/app/actions/auth';
import { forgotPasswordAction } from '@/app/actions';
import ModernTruckAnimation from './ModernTruckAnimation';
import { motion, AnimatePresence } from 'framer-motion';

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
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12 relative"
        >
          <div className="absolute inset-0 bg-red-600 blur-[80px] opacity-20" />
          <ModernTruckAnimation />
        </motion.div>
        
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-black text-white tracking-tighter italic leading-none"
          >
            TRUCK<span className="text-red-600">LOVERS</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-3 mt-4"
          >
            <div className="h-px w-8 bg-white/10" />
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.5em]">Premium Experience</p>
            <div className="h-px w-8 bg-white/10" />
          </motion.div>
        </div>

        <motion.form 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit} 
          className="w-full space-y-4"
        >
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-[10px] font-black text-center uppercase tracking-widest"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-2xl text-[10px] font-black text-center uppercase tracking-widest"
              >
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {mode === 'register' && (
              <div className="group relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-red-500 transition-colors" size={18} />
                <input 
                  name="name"
                  type="text"
                  required
                  placeholder="Nume Complet"
                  className="w-full bg-slate-900 border border-white/[0.05] rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-1 focus:ring-red-600/50 outline-none transition-all text-sm font-bold placeholder:text-slate-700"
                />
              </div>
            )}

            <div className="group relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-red-500 transition-colors" size={18} />
              <input 
                name="email"
                type="email"
                required
                placeholder="Email"
                className="w-full bg-slate-900 border border-white/[0.05] rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-1 focus:ring-red-600/50 outline-none transition-all text-sm font-bold placeholder:text-slate-700"
              />
            </div>

            {mode !== 'forgot' && (
              <div className="group relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-red-500 transition-colors" size={18} />
                <input 
                  name="password"
                  type="password"
                  required
                  placeholder="Parolă"
                  className="w-full bg-slate-900 border border-white/[0.05] rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-1 focus:ring-red-600/50 outline-none transition-all text-sm font-bold placeholder:text-slate-700"
                />
              </div>
            )}
          </div>
          
          {mode === 'login' && (
            <div className="flex justify-end px-1">
              <button 
                type="button" 
                onClick={() => setMode('forgot')}
                className="text-[9px] font-black text-slate-600 uppercase tracking-widest hover:text-red-500 transition-colors"
              >
                Ai uitat parola?
              </button>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-600/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-xs tracking-[0.2em] uppercase mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {mode === 'login' ? 'Intră în Cont' : mode === 'register' ? 'Creează Cont' : 'Trimite Email'}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </motion.form>

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
