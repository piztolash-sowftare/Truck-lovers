'use client';

import { motion } from 'framer-motion';

export default function ModernTruckAnimation() {
  return (
    <div className="relative w-64 h-32 flex items-center justify-center overflow-hidden">
      <motion.div 
        className="relative flex items-end"
        initial={{ x: -300 }}
        animate={{ x: 300 }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "linear"
        }}
      >
        <svg
          viewBox="0 0 200 60"
          className="w-48 h-auto fill-none stroke-red-600 stroke-[2.5] drop-shadow-[0_0_15px_rgba(255,31,31,0.5)]"
        >
          {/* Remorca (Trailer) */}
          <rect x="10" y="10" width="110" height="35" rx="4" />
          <circle cx="30" cy="50" r="5" className="fill-red-600/20" />
          <circle cx="50" cy="50" r="5" className="fill-red-600/20" />
          <circle cx="70" cy="50" r="5" className="fill-red-600/20" />

          {/* Connection */}
          <path d="M120,40 L130,40" />

          {/* Captractor (Tractor Unit) */}
          <path d="M130,45 L130,15 L160,15 L170,25 L185,25 L190,40 L190,45 L130,45 Z" />
          <rect x="140" y="20" width="20" height="15" rx="2" className="stroke-red-600/40" />
          
          {/* Wheels Tractor */}
          <circle cx="145" cy="50" r="6" className="fill-red-600/20" />
          <circle cx="175" cy="50" r="6" className="fill-red-600/20" />
        </svg>

        {/* Dynamic Light trail behind truck */}
        <div className="absolute -left-20 bottom-8 h-1 w-20 bg-gradient-to-r from-transparent to-red-600/40 blur-sm" />
      </motion.div>
      
      {/* HUD Speed lines */}
      <div className="absolute inset-0 flex flex-col justify-center gap-4 pointer-events-none opacity-20">
        {[1, 2, 3].map((i) => (
          <motion.div 
            key={i}
            className="h-px bg-white w-full"
            animate={{ x: [400, -400], opacity: [0, 1, 0] }}
            transition={{ duration: 1 / i, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
          />
        ))}
      </div>

      {/* Road line */}
      <div className="absolute bottom-6 w-full h-px bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
    </div>
  );
}
