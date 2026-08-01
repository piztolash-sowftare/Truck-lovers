'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Truck } from 'lucide-react';
import { sendGlobalMessage } from '@/app/actions';
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';

interface Message {
  id: number;
  content: string;
  createdAt: Date | null;
  user: {
    name: string;
    image: string | null;
    role: string | null;
  };
}

export default function ChatRoom({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
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
      createdAt: new Date(),
      user: { name: 'Colegu', image: null, role: 'driver' } 
    };

    setMessages([newMessage, ...messages]);
    setInput('');
    await sendGlobalMessage(input);
  };

  return (
    <div className="flex flex-col h-[70vh] bg-slate-900/50 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 flex flex-col-reverse gap-6 no-scrollbar"
      >
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-red-600/20">
                {msg.user.name[0]}
              </div>
              <span className="font-black text-xs text-slate-200 tracking-tight">{msg.user.name}</span>
              {msg.user.role === 'driver' && <Truck size={10} className="text-red-500" />}
              <span className="text-[9px] text-slate-500 font-bold uppercase ml-auto">
                {msg.createdAt ? formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true, locale: ro }) : 'acum'}
              </span>
            </div>
            <div className="bg-white/5 border border-white/5 p-4 rounded-3xl rounded-tl-none shadow-xl max-w-[90%]">
              <p className="text-slate-200 text-sm font-medium leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-slate-950/80 backdrop-blur-md border-t border-white/5 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Emite pe canalul 22..."
          className="flex-1 bg-slate-900 border border-white/5 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all placeholder:text-slate-600 font-bold"
        />
        <button
          type="submit"
          className="bg-red-600 text-white p-3 rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/30 active:scale-90"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
