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
      await checkInToParking(0); // Mock leave
      onClose();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#020617] rounded-t-[2.5rem] overflow-hidden border-t border-white/10 shadow-2xl">
      <header className="p-5 border-b border-white/5 flex items-center justify-between bg-slate-950/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 flex items-center justify-center text-red-500 border border-red-500/20">
            <Truck size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-tight">{parking.name}</h3>
            <p className="text-[9px] text-red-500 font-black uppercase tracking-widest">Chat Local</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleLeave}
            className="p-2 text-slate-500 hover:text-red-500 transition-colors bg-white/5 rounded-lg"
            title="Părăsește parcarea"
          >
            <LogOut size={16} />
          </button>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-lg">
            <X size={16} />
          </button>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.userId === currentUserId ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-2 mb-1.5 px-2">
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{msg.user?.name}</span>
               <span className="text-[8px] text-slate-700">{formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true, locale: ro })}</span>
            </div>
            <div className={`p-4 rounded-2xl max-w-[85%] text-sm font-medium leading-relaxed ${msg.userId === currentUserId ? 'bg-red-600 text-white rounded-tr-none shadow-lg shadow-red-600/10' : 'bg-slate-900 border border-white/5 text-slate-200 rounded-tl-none shadow-xl'}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-slate-950/80 backdrop-blur-md border-t border-white/5 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Salută colegii din parcare..."
          className="flex-1 bg-slate-900 border border-white/5 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-600/30 transition-all placeholder:text-slate-700"
        />
        <button type="submit" className="bg-red-600 text-white p-4 rounded-2xl shadow-lg shadow-red-600/20 active:scale-90 transition-all">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
