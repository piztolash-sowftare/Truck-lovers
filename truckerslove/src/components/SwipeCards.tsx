'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, Truck, MapPin, Star, Info } from 'lucide-react';
import { swipeUser } from '@/app/actions';

interface User {
  id: number;
  name: string;
  age: number | null;
  bio: string | null;
  image: string | null;
  images: string | null;
  role: string | null;
  routeStart: string | null;
  routeEnd: string | null;
  truckModel: string | null;
  isAdmin: boolean | null;
}

export default function SwipeCards({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const scale = useTransform(x, [-200, 0, 200], [0.85, 1, 0.85]);
  
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
      x.set(0);
    }
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    const user = users[currentIndex];
    let images = [];
    try {
      images = user?.images ? JSON.parse(user.images) : [user?.image];
    } catch (e) { images = [user?.image]; }
    
    if (currentImageIndex < images.length - 1) setCurrentImageIndex(prev => prev + 1);
    else setCurrentImageIndex(0);
  };

  const currentUser = users[currentIndex];

  if (!currentUser || currentIndex >= users.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center p-12">
        <div className="relative mb-10">
           <div className="absolute inset-0 bg-red-600 blur-[80px] opacity-10" />
           <Truck size={80} className="text-slate-900 relative" />
        </div>
        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4">Radar în Așteptare</h2>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em] leading-relaxed">Nu mai sunt semnale în zonă. Revino în cursă mai târziu sau extinde raza radarului.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[75vh] flex flex-col items-center justify-center touch-none">
      <AnimatePresence>
        {showMatch && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-10 text-center"
          >
            <motion.div
              animate={{ x: [-500, 500] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/4 opacity-10"
            >
              <Truck size={200} className="text-red-600" />
            </motion.div>
            
            <h2 className="text-8xl font-black text-white italic tracking-tighter mb-4 drop-shadow-[0_0_30px_rgba(255,31,31,0.5)]">MATCH!</h2>
            <p className="text-red-500 text-sm font-black uppercase tracking-[0.8em] mb-16">Ești pe același traseu cu {currentUser.name}</p>
            
            <div className="flex gap-4 mb-20 relative">
               <div className="w-32 h-32 rounded-[2.5rem] border-4 border-red-600 overflow-hidden shadow-[0_0_50px_rgba(255,31,31,0.3)] z-10 scale-110">
                 <img src={currentUser.image || ''} className="w-full h-full object-cover" />
               </div>
            </div>

            <button 
              onClick={() => {
                setShowMatch(false);
                setCurrentIndex(prev => prev + 1);
                setCurrentImageIndex(0);
                x.set(0);
              }}
              className="btn-primary px-16 py-6 rounded-[2rem] text-sm"
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
          className="absolute w-full h-full bg-[#050505] rounded-[3.5rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8)] overflow-hidden cursor-grab active:cursor-grabbing border border-white/[0.05]"
        >
          <div className="relative h-full w-full">
            {/* Action Badges */}
            <motion.div style={{ opacity: likeOpacity }} className="absolute top-12 left-12 z-30 border-4 border-emerald-500 px-8 py-3 rounded-2xl -rotate-12 bg-emerald-500/10 backdrop-blur-xl">
              <span className="text-4xl font-black text-emerald-500 uppercase tracking-widest italic">MĂ BAG</span>
            </motion.div>
            <motion.div style={{ opacity: dislikeOpacity }} className="absolute top-12 right-12 z-30 border-4 border-red-500 px-8 py-3 rounded-2xl rotate-12 bg-red-500/10 backdrop-blur-xl">
              <span className="text-4xl font-black text-red-500 uppercase tracking-widest italic">PAS</span>
            </motion.div>

            {/* Top Info Bar */}
            <div className="absolute top-8 left-8 right-8 z-30 flex justify-between items-center pointer-events-none">
               <div className="flex gap-2">
                  {currentUser.isAdmin && (
                    <div className="bg-yellow-500 text-black text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg">ELITE A</div>
                  )}
                  <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                     <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                     <span className="text-[7px] font-black text-white uppercase tracking-widest">Active Now</span>
                  </div>
               </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
            
            {/* Gallery Engine */}
            <div className="w-full h-full bg-slate-900 flex items-center justify-center relative" onClick={nextPhoto}>
              {(() => {
                let images = [];
                try { images = currentUser.images ? JSON.parse(currentUser.images) : [currentUser.image]; } catch (e) { images = [currentUser.image]; }
                const currentImg = images[currentImageIndex];
                
                return currentImg ? (
                  <img src={currentImg} alt={currentUser.name} className="w-full h-full object-cover select-none pointer-events-none" />
                ) : (
                  <div className="flex flex-col items-center text-slate-800">
                    <Truck size={120} />
                  </div>
                );
              })()}

              {/* Progress Bars */}
              <div className="absolute top-4 left-6 right-6 flex gap-1.5 z-30">
                {(() => {
                   let images = [];
                   try { images = currentUser.images ? JSON.parse(currentUser.images) : [currentUser.image]; } catch (e) { images = [currentUser.image]; }
                   if (images.length <= 1) return null;
                   return images.map((_: any, i: number) => (
                     <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i === currentImageIndex ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,1)]' : 'bg-white/20'}`} />
                   ));
                })()}
              </div>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 right-0 p-10 z-20">
              <div className="flex items-end gap-3 mb-3">
                <h3 className="text-5xl font-black text-white tracking-tighter italic leading-none">{currentUser.name}, {currentUser.age || 28}</h3>
                <div className="bg-red-600 p-2 rounded-xl mb-1 shadow-lg shadow-red-600/30">
                  <Truck size={16} className="text-white" />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {currentUser.routeStart && (
                  <div className="flex items-center gap-2 text-[8px] font-black uppercase bg-white/5 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/[0.05] text-slate-300 tracking-widest">
                    <MapPin size={10} className="text-red-500" />
                    <span>{currentUser.routeStart} → {currentUser.routeEnd}</span>
                  </div>
                )}
                {currentUser.truckModel && (
                  <div className="flex items-center gap-2 text-[8px] font-black uppercase bg-red-600/10 backdrop-blur-xl rounded-xl px-4 py-2 border border-red-500/10 text-red-500 tracking-widest">
                    <Star size={10} fill="currentColor" />
                    <span>{currentUser.truckModel}</span>
                  </div>
                )}
              </div>

              <div className="bg-white/5 backdrop-blur-md p-5 rounded-[2rem] border border-white/[0.03]">
                 <p className="text-xs font-medium text-slate-400 leading-relaxed line-clamp-2">
                   "{currentUser.bio || "Drumuri bune și inimi pline pe tot continentul!"}"
                 </p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Buttons */}
      <div className="absolute -bottom-10 flex items-center gap-10 z-30">
        <button
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 rounded-full bg-slate-900 shadow-2xl flex items-center justify-center text-red-600 hover:scale-110 transition-all border border-white/5 active:bg-slate-800 active:scale-95"
        >
          <X size={32} strokeWidth={3} />
        </button>
        <button
          onClick={() => handleSwipe('right')}
          className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-red-500 to-red-700 shadow-[0_20px_50px_rgba(255,31,31,0.3)] flex items-center justify-center text-white hover:scale-110 transition-all active:scale-90"
        >
          <Heart size={45} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
