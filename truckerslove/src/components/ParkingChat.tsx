'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Truck, X, LogOut } from 'lucide-react';
import { sendParkingMessage, getParkingMessages, checkInToParking } from '@/app/actions';
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';

export default function ParkingChat({ parking, onClose, currentUserId }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const msgs = await getParkingMessages(parking.id);
      setMessages(msgs);
    }
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [parking.id]);

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
      userId: currentUserId,
      createdAt: new Date(),
      user: { name: 'Eu' }
    };

    setMessages([...messages, newMessage]);
    setInput('');
    await sendParkingMessage(parking.id, input);
  };

  const handleLeave = async () => {
    if (confirm('Vrei să părăsești această parcare?')) {
      await checkInToParking(0);
      onClose();
    }
  };

  return (
    <div className="flex flex-col h-full bg-black rounded-t-[3rem] overflow-hidden border-t border-white/10 shadow-2xl">
      <header className="p-6 border-b border-white/5 flex items-center justify-between bg-black/50 backdrop-blur-3xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#ff385c] flex items-center justify-center text-white shadow-xl rotate-[-4deg]">
            <Truck size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">{parking.name}</h3>
            <div className="flex items-center gap-1.5 mt-1">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]" />
               <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.4em]">Live Station</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleLeave}
            className="p-2.5 text-slate-500 hover:text-red-500 transition-colors bg-white/5 rounded-xl border border-white/5"
            title="Părăsește parcarea"
          >
            <LogOut size={18} />
          </button>
          <button onClick={onClose} className="p-2.5 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-xl border border-white/5">
            <X size={18} />
          </button>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.userId === currentUserId ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-end gap-3 ${msg.userId === currentUserId ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-white/10 overflow-hidden flex-none mb-1 shadow-xl relative">
                 {msg.user?.image ? <img src={msg.user.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-red-500 font-black text-xs">{msg.user?.name?.[0]}</div>}
              </div>
              <div className={`flex flex-col ${msg.userId === currentUserId ? 'items-end' : 'items-start'} max-w-[80%]`}>
                <div className={`p-4 rounded-[1.5rem] text-sm font-medium leading-relaxed ${msg.userId === currentUserId ? 'bg-[#ff385c] text-white rounded-br-none shadow-xl' : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-none shadow-2xl'}`}>
                  {msg.content}
                </div>
                <span className="text-[7px] font-black text-slate-700 uppercase tracking-widest mt-1 px-1">
                  {msg.user?.name} • {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true, locale: ro })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-5 bg-black border-t border-white/5 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrie un mesaj colegilor..."
          className="flex-1 bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-600 transition-all placeholder:text-zinc-800 font-bold"
        />
        <button type="submit" className="bg-[#ff385c] text-white p-4 rounded-2xl shadow-lg shadow-red-600/20 active:scale-90 transition-all">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
