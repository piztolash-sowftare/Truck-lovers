'use client';

import React, { useState } from 'react';
import { Bell, Heart, MessageCircle, Truck, Star, X, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { markNotificationsRead } from '@/app/actions';
import Link from 'next/link';

export default function NotificationBell({ initialNotifications }: { initialNotifications: any[] }) {
  const [show, setShow] = useState(false);
  const [notifs, setNotifs] = useState(initialNotifications);
  const unreadCount = notifs.filter(n => !n.read).length;

  const handleOpen = async () => {
    setShow(!show);
    if (!show && unreadCount > 0) {
      await markNotificationsRead();
      setNotifs(notifs.map(n => ({ ...n, read: true })));
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={handleOpen}
        className="p-3 bg-white/5 border border-white/5 rounded-2xl text-slate-500 hover:text-white transition-all relative group"
      >
        <Bell size={20} className={unreadCount > 0 ? 'animate-[swing_2s_ease-in-out_infinite]' : ''} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 bg-red-600 rounded-full border-2 border-[#020617] text-[8px] font-black text-white flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.5)]">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {show && (
          <>
            <div className="fixed inset-0 z-[100]" onClick={() => setShow(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-16 right-0 w-80 bg-slate-950 border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,1)] z-[101] overflow-hidden flex flex-col max-h-[70vh]"
            >
              <div className="p-6 bg-slate-900 border-b border-white/5 flex items-center justify-between">
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Notificări</h4>
                <div className="w-8 h-8 rounded-xl bg-red-600/20 flex items-center justify-center text-red-500">
                  <Star size={14} />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                {notifs.length === 0 ? (
                  <div className="py-12 text-center">
                    <Bell size={32} className="mx-auto text-slate-800 mb-2 opacity-20" />
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Niciun semnal recepționat</p>
                  </div>
                ) : (
                  notifs.map((n) => (
                    <Link 
                      key={n.id}
                      href={n.type === 'comment' || n.type === 'feed_like' ? '/feed' : n.type === 'match' ? '/messages' : `/profile/${n.actorId}`}
                      onClick={() => setShow(false)}
                      className={`flex items-center gap-3 p-4 rounded-3xl transition-all border ${n.read ? 'bg-transparent border-transparent' : 'bg-red-600/5 border-red-600/10'}`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/5 overflow-hidden flex-none relative">
                        {n.actor.image ? <img src={n.actor.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-red-500 font-black">{n.actor.name[0]}</div>}
                        <div className={`absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-slate-950 shadow-lg ${n.type === 'like' || n.type === 'feed_like' ? 'bg-red-600' : n.type === 'match' ? 'bg-emerald-500' : 'bg-blue-600'}`}>
                           {n.type === 'like' || n.type === 'feed_like' ? <Heart size={6} fill="white" className="text-white" /> : n.type === 'match' ? <Check size={6} className="text-white" /> : <MessageCircle size={6} fill="white" className="text-white" />}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-300 font-bold leading-tight">
                           <span className="text-white font-black">{n.actor.name}</span> 
                           {n.type === 'like' && ' ți-a dat o inimioară!'}
                           {n.type === 'feed_like' && ' ți-a apreciat postarea.'}
                           {n.type === 'comment' && ' a lăsat un comentariu.'}
                           {n.type === 'match' && ' este perechea ta de drum!'}
                        </p>
                        <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mt-1">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: ro })}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
