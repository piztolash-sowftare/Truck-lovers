'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Truck, ArrowLeft, MoreVertical, ShieldAlert, User, Trash2 } from 'lucide-react';
import { sendPrivateMessage, unmatchUser } from '@/app/actions';
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatView({ matchId, otherUser, initialMessages, currentUserId }: any) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      id: Math.random(),
      content: input,
      senderId: currentUserId,
      createdAt: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInput('');
    await sendPrivateMessage(matchId, input);
  };

  const handleUnmatch = async () => {
    if (confirm('Ești sigur că vrei să anulezi perechea?')) {
      await unmatchUser(matchId);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-[#020617] relative">
      {/* Chat Header */}
      <header className="p-5 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <Link href="/messages" className="p-2 -ml-2 text-slate-500 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 overflow-hidden relative shadow-lg">
            {otherUser?.image ? (
              <img src={otherUser.image} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-red-600 font-black text-sm">{otherUser?.name?.[0]}</div>
            )}
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
          </div>
          <div>
            <h3 className="font-black text-white text-sm tracking-tight">{otherUser?.name}</h3>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1">
              <Truck size={8} className="text-red-500" /> {otherUser?.truckModel || 'Pe drum...'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-slate-500 hover:text-white transition-colors"
        >
          <MoreVertical size={20} />
        </button>
      </header>

      {/* Settings Dropdown */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 right-4 w-48 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-30 p-2 overflow-hidden"
          >
            <button 
              onClick={() => alert('Profil vizualizat (simulat)')}
              className="w-full flex items-center gap-3 p-3 text-xs font-bold text-slate-300 hover:bg-white/5 rounded-xl transition-all"
            >
              <User size={16} className="text-slate-500" /> Vezi Profil
            </button>
            <button className="w-full flex items-center gap-3 p-3 text-xs font-bold text-slate-300 hover:bg-white/5 rounded-xl transition-all">
              <ShieldAlert size={16} className="text-slate-500" /> Blochează
            </button>
            <div className="h-px bg-white/5 my-2" />
            <button 
              onClick={handleUnmatch}
              className="w-full flex items-center gap-3 p-3 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
            >
              <Trash2 size={16} /> Anulează Match
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth"
      >
        {messages.map((msg: any) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1.5`}>
                <div 
                  className={`p-4 rounded-3xl text-sm font-medium leading-relaxed shadow-xl ${
                    isMe 
                    ? 'bg-red-600 text-white rounded-tr-none' 
                    : 'bg-slate-900 border border-white/5 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest px-2">
                  {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true, locale: ro })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="p-4 bg-slate-950/80 backdrop-blur-md border-t border-white/5 flex gap-3 z-20">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrie un mesaj..."
          className="flex-1 bg-slate-900 border border-white/5 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-600/50 transition-all font-medium placeholder:text-slate-700"
        />
        <button
          type="submit"
          className="bg-red-600 text-white p-4 rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-90"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
