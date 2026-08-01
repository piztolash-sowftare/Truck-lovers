'use client';

import { motion } from 'framer-motion';

export default function ModernTruckAnimation() {
  return (
    <div className="relative w-48 h-24 flex items-center justify-center overflow-hidden">
      <motion.svg
        viewBox="0 0 160 60"
        className="w-full h-full fill-none stroke-red-600 stroke-[2]"
        initial={{ x: -200 }}
        animate={{ x: 200 }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "linear"
        }}
      >
        {/* Tractor (Captractor) */}
        <path d="M100,45 L100,20 L130,20 L135,25 L145,25 L150,40 L150,45 L100,45" />
        <path d="M130,20 L150,20" />
        {/* Wheels Tractor */}
        <circle cx="110" cy="48" r="5" />
        <circle cx="138" cy="48" r="5" />
        
        {/* Trailer (Remorca) */}
        <path d="M10,45 L10,15 L95,15 L95,45 L10,45" />
        {/* Connection */}
        <line x1="95" y1="40" x2="100" y2="40" />
        {/* Wheels Trailer */}
        <circle cx="25" cy="48" r="5" />
        <circle cx="42" cy="48" r="5" />
        <circle cx="59" cy="48" r="5" />
      </motion.svg>
      
      {/* Speed lines for high-speed effect */}
      <div className="absolute inset-0 flex flex-col justify-center gap-3 pr-20 pointer-events-none">
        <motion.div 
          className="h-0.5 bg-red-600/40 w-full"
          animate={{ scaleX: [0, 1, 0], x: [150, -150] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="h-0.5 bg-red-600/20 w-3/4 self-end"
          animate={{ scaleX: [0, 1, 0], x: [120, -120] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear", delay: 0.2 }}
        />
        <motion.div 
          className="h-0.5 bg-red-600/10 w-1/2"
          animate={{ scaleX: [0, 1, 0], x: [100, -100] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear", delay: 0.4 }}
        />
      </div>

      {/* Ground glow */}
      <div className="absolute bottom-4 w-full h-px bg-red-600/20 blur-sm shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
    </div>
  );
}
