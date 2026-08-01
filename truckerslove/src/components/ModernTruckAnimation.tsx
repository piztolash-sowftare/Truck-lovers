'use client';

import { motion } from 'framer-motion';

export default function ModernTruckAnimation() {
  return (
    <div className="relative w-32 h-20 flex items-center justify-center overflow-hidden">
      <motion.svg
        viewBox="0 0 100 50"
        className="w-full h-full fill-none stroke-red-600 stroke-[1.5]"
        initial={{ x: -100 }}
        animate={{ x: 100 }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "linear"
        }}
      >
        <path d="M10,35 L10,15 L60,15 L60,10 L85,10 L90,25 L90,35 L85,35" />
        <path d="M60,15 L90,15" />
        <circle cx="25" cy="38" r="4" />
        <circle cx="45" cy="38" r="4" />
        <circle cx="80" cy="38" r="4" />
      </motion.svg>
      
      {/* Speed lines */}
      <div className="absolute inset-0 flex flex-col justify-center gap-2 pr-12">
        <motion.div 
          className="h-0.5 bg-red-600/30 w-full"
          animate={{ scaleX: [0, 1, 0], x: [100, -100] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="h-0.5 bg-red-600/20 w-3/4 self-end"
          animate={{ scaleX: [0, 1, 0], x: [80, -80] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
        />
      </div>
    </div>
  );
}
