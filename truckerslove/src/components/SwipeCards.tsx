'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, Truck, MapPin, Star, ShieldCheck } from 'lucide-react';
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
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const scale = useTransform(x, [-200, 0, 200], [0.9, 1, 0.9]);
  
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
    try { images = user?.images ? JSON.parse(user.images) : [user?.image]; } catch (e) { images = [user?.image]; }
    if (currentImageIndex < images.length - 1) setCurrentImageIndex(prev => prev + 1);
    else setCurrentImageIndex(0);
  };

  const currentUser = users[currentIndex];

  if (!currentUser || currentIndex >= users.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center p-12">
        <div className="w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center mb-8 border border-white/5 shadow-2xl">
           <Truck size={40} className="text-zinc-800" />
        </div>
        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4">Radar Închis</h2>
        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.6em] leading-relaxed">Nicio cursă disponibilă. Revino mai târziu pe frecvență.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[78vh] flex flex-col items-center justify-center touch-none">
      <AnimatePresence>
        {showMatch && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-12 text-center"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#ff003c]/20 via-transparent to-transparent" />
            
            <h2 className="text-7xl font-black text-white italic tracking-tighter mb-4 animate-bounce">MATCH!</h2>
            <p className="text-[#ff003c] text-sm font-black uppercase tracking-[1em] mb-16 opacity-80">Connected Elite</p>
            
            <div className="w-48 h-48 rounded-[3.5rem] border-4 border-[#ff003c] overflow-hidden shadow-[0_0_50px_rgba(255,0,60,0.4)] mb-20 relative scale-110">
               <img src={currentUser.image || ''} className="w-full h-full object-cover" />
            </div>

            <button 
              onClick={() => {
                setShowMatch(false);
                setCurrentIndex(prev => prev + 1);
                setCurrentImageIndex(0);
                x.set(0);
              }}
              className="btn-premium px-20 py-7 text-xs bg-white text-black"
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
          className="absolute w-full h-full bg-[#0a0a0a] rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,1)] overflow-hidden cursor-grab active:cursor-grabbing border border-white/5"
        >
          {/* Action Labels */}
          <motion.div style={{ opacity: likeOpacity }} className="absolute top-12 left-12 z-40 bg-emerald-500 text-black font-black px-6 py-2 rounded-xl -rotate-12 uppercase text-2xl shadow-2xl">MĂ BAG</motion.div>
          <motion.div style={{ opacity: dislikeOpacity }} className="absolute top-12 right-12 z-40 bg-red-600 text-white font-black px-6 py-2 rounded-xl rotate-12 uppercase text-2xl shadow-2xl">PAS</motion.div>

          <div className="relative h-full w-full">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />
            
            <div className="w-full h-full bg-zinc-900 flex items-center justify-center relative" onClick={nextPhoto}>
              {(() => {
                let images = [];
                try { images = currentUser.images ? JSON.parse(currentUser.images) : [currentUser.image]; } catch (e) { images = [currentUser.image]; }
                const currentImg = images[currentImageIndex];
                return currentImg ? (
                  <img src={currentImg} alt={currentUser.name} className="w-full h-full object-cover pointer-events-none" />
                ) : (
                  <Truck size={100} className="text-zinc-800" />
                );
              })()}
              
              <div className="absolute top-4 left-8 right-8 flex gap-1.5 z-30">
                {(() => {
                   let images = [];
                   try { images = currentUser.images ? JSON.parse(currentUser.images) : [currentUser.image]; } catch (e) { images = [currentUser.image]; }
                   if (images.length <= 1) return null;
                   return images.map((_: any, i: number) => (
                     <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i === currentImageIndex ? 'bg-white shadow-[0_0_10px_white]' : 'bg-white/20'}`} />
                   ));
                })()}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-10 z-20 space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-5xl font-black text-white tracking-tighter leading-none italic">{currentUser.name}, {currentUser.age}</h3>
                {currentUser.isAdmin && (
                  <div className="bg-[#ffcc00] text-black text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg">ELITE A</div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {currentUser.routeStart && (
                  <div className="flex items-center gap-2 text-[8px] font-black uppercase bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 tracking-[0.2em] text-zinc-300">
                    <MapPin size={10} className="text-[#ff003c]" />
                    {currentUser.routeStart} → {currentUser.routeEnd}
                  </div>
                )}
                {currentUser.truckModel && (
                  <div className="flex items-center gap-2 text-[8px] font-black uppercase bg-[#ff003c]/20 backdrop-blur-md px-4 py-2 rounded-xl border border-[#ff003c]/20 tracking-[0.2em] text-[#ff003c]">
                    <Truck size={10} />
                    {currentUser.truckModel}
                  </div>
                )}
              </div>

              <p className="text-sm font-medium text-zinc-400 line-clamp-2 leading-relaxed italic opacity-80">
                "{currentUser.bio || "Drumuri bune și inimi pline!"}"
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute -bottom-10 flex items-center gap-10 z-50">
        <button onClick={() => handleSwipe('left')} className="w-16 h-16 rounded-full bg-[#111] border border-white/5 shadow-2xl flex items-center justify-center text-red-500 hover:scale-110 active:scale-90 transition-all">
          <X size={32} strokeWidth={3} />
        </button>
        <button onClick={() => handleSwipe('right')} className="w-20 h-20 rounded-[2rem] bg-[#ff003c] shadow-[0_15px_40px_rgba(255,0,60,0.4)] flex items-center justify-center text-white hover:scale-110 active:scale-90 transition-all">
          <Heart size={40} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
