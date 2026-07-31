'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, Truck, MapPin } from 'lucide-react';
import { swipeUser } from '@/app/actions';

interface User {
  id: number;
  name: string;
  age: number | null;
  bio: string | null;
  image: string | null;
  images: string | null; // JSON array
  role: string | null;
  routeStart: string | null;
  routeEnd: string | null;
  truckModel: string | null;
}

export default function SwipeCards({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const scale = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8]);
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const dislikeOpacity = useTransform(x, [-50, -150], [0, 1]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    const user = users[currentIndex];
    if (!user) return;

    const result = await swipeUser(user.id, direction === 'right' ? 'like' : 'dislike');
    if (result.match) {
      setShowMatch(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setCurrentImageIndex(0);
    }
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    const user = users[currentIndex];
    const images = user?.images ? JSON.parse(user.images) : [user?.image];
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    } else {
      setCurrentImageIndex(0);
    }
  };

  const currentUser = users[currentIndex];

  if (!currentUser || currentIndex >= users.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
        <Truck size={64} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold">Nu mai sunt tiriști în zonă!</h2>
        <p className="text-gray-500">Mai încearcă mai târziu sau schimbă ruta.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[65vh] flex flex-col items-center justify-center touch-none">
      <AnimatePresence>
        {showMatch && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-[100] bg-slate-950/95 flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.div
              animate={{ x: [-200, 200] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mb-8"
            >
              <Truck size={80} className="text-red-600" />
            </motion.div>
            <h2 className="text-6xl font-black text-white italic tracking-tighter mb-4">MATCH!</h2>
            <p className="text-slate-400 text-xl font-bold mb-12 uppercase tracking-widest">Ai găsit un partener de drum!</p>
            
            <div className="flex gap-4 mb-12">
               <div className="w-24 h-24 rounded-full border-4 border-red-600 overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                 <img src={currentUser.image || ''} className="w-full h-full object-cover" />
               </div>
            </div>

            <button 
              onClick={() => {
                setShowMatch(false);
                setCurrentIndex(prev => prev + 1);
                setCurrentImageIndex(0);
              }}
              className="premium-btn w-full px-8 py-5"
            >
              CONTINUĂ CURSA
            </button>
          </motion.div>
        )}

        <motion.div
          key={currentUser.id}
          style={{ x, rotate, opacity, scale }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.x > 100) handleSwipe('right');
            else if (info.offset.x < -100) handleSwipe('left');
          }}
          className="absolute w-full h-full bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing border border-white/10"
        >
          <div className="relative h-full w-full">
            {/* Action Badges */}
            <motion.div style={{ opacity: likeOpacity }} className="absolute top-10 left-10 z-30 border-4 border-emerald-500 px-6 py-2 rounded-2xl -rotate-12">
              <span className="text-4xl font-black text-emerald-500 uppercase tracking-widest">MĂ BAG</span>
            </motion.div>
            <motion.div style={{ opacity: dislikeOpacity }} className="absolute top-10 right-10 z-30 border-4 border-red-500 px-6 py-2 rounded-2xl rotate-12">
              <span className="text-4xl font-black text-red-500 uppercase tracking-widest">PAS</span>
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />
            
            {/* Image & Gallery */}
            <div className="w-full h-full bg-slate-800 flex items-center justify-center relative" onClick={nextPhoto}>
              {(() => {
                const images = currentUser.images ? JSON.parse(currentUser.images) : [currentUser.image];
                const currentImg = images[currentImageIndex];
                
                return currentImg ? (
                  <img src={currentImg} alt={currentUser.name} className="w-full h-full object-cover select-none pointer-events-none" />
                ) : (
                  <div className="flex flex-col items-center text-slate-700">
                    <User size={120} />
                  </div>
                );
              })()}

              {/* Progress Bars for Images */}
              <div className="absolute top-4 left-4 right-4 flex gap-1 z-30">
                {(() => {
                   const images = currentUser.images ? JSON.parse(currentUser.images) : [currentUser.image];
                   if (images.length <= 1) return null;
                   return images.map((_: any, i: number) => (
                     <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i === currentImageIndex ? 'bg-white' : 'bg-white/30'}`} />
                   ));
                })()}
              </div>

              {/* Tap Indicator Hint */}
              <div className="absolute top-0 right-0 bottom-0 w-1/3 z-20 cursor-pointer" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
              <div className="flex items-end gap-3 mb-2">
                <h3 className="text-4xl font-black text-white tracking-tighter">{currentUser.name}, {currentUser.age || 28}</h3>
                <div className="bg-red-600 p-1.5 rounded-lg mb-2 shadow-lg shadow-red-600/40">
                  <Truck size={16} className="text-white" />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {currentUser.routeStart && (
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/5 text-slate-200">
                    <MapPin size={12} className="text-red-500" />
                    <span>{currentUser.routeStart} → {currentUser.routeEnd}</span>
                  </div>
                )}
                {currentUser.truckModel && (
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase bg-red-600/20 backdrop-blur-md rounded-xl px-4 py-2 border border-red-500/20 text-red-400">
                    <Truck size={12} />
                    <span>{currentUser.truckModel}</span>
                  </div>
                )}
              </div>

              <p className="text-sm font-bold text-slate-400 leading-relaxed italic line-clamp-2">
                "{currentUser.bio || "Drumuri bune și inimi pline pe tot continentul!"}"
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute -bottom-8 flex items-center gap-8 z-30">
        <button
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 rounded-full bg-slate-900 shadow-2xl flex items-center justify-center text-red-500 hover:scale-110 transition-transform border border-white/5 active:bg-slate-800"
        >
          <X size={32} />
        </button>
        <button
          onClick={() => handleSwipe('right')}
          className="w-20 h-20 rounded-full bg-red-600 shadow-2xl shadow-red-600/40 flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95"
        >
          <Heart size={40} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}

function User({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
