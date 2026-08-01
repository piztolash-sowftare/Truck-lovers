'use client';

import { motion } from 'framer-motion';

export default function ModernTruckAnimation() {
  return (
    <div className="relative w-full h-40 flex items-center justify-center pointer-events-none select-none overflow-hidden">
      <motion.div
        initial={{ x: -400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "circOut" }}
        className="relative"
      >
        <svg viewBox="0 0 300 100" className="w-80 h-auto fill-none drop-shadow-[0_0_20px_rgba(255,0,60,0.3)]">
          <defs>
            <linearGradient id="truckBody" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#222" />
              <stop offset="50%" stopColor="#111" />
              <stop offset="100%" stopColor="#000" />
            </linearGradient>
            <linearGradient id="accentLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff003c" />
              <stop offset="100%" stopColor="#9e002c" />
            </linearGradient>
          </defs>
          
          {/* Trailer (Remorca) */}
          <rect x="20" y="20" width="160" height="50" rx="4" fill="url(#truckBody)" stroke="#333" strokeWidth="1" />
          <path d="M20,25 L180,25" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          
          {/* Tractor (Captractor) */}
          <path fill="url(#truckBody)" stroke="#333" strokeWidth="1" d="M185,70 L185,30 L220,30 L235,45 L255,45 L260,55 L260,70 Z" />
          
          {/* Cabin Window */}
          <path fill="#1a1a1a" d="M225,35 L245,35 L250,45 L225,45 Z" />
          <path fill="rgba(255,0,60,0.1)" d="M225,35 L245,35 L250,45 L225,45 Z" />

          {/* Red Accent Line */}
          <path stroke="url(#accentLine)" strokeWidth="2" strokeLinecap="round" d="M25,65 L175,65 M190,65 L255,65" />
          
          {/* Wheels with Spin */}
          <g>
            {[45, 75, 105, 145, 200, 240].map((cx, i) => (
              <motion.g key={i}>
                <circle cx={cx} cy="75" r="10" fill="#000" stroke="#333" strokeWidth="1" />
                <motion.circle 
                  cx={cx} cy="75" r="6" 
                  stroke="#ff003c" 
                  strokeWidth="2" 
                  strokeDasharray="4 4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                />
                <circle cx={cx} cy="75" r="2" fill="#ff003c" />
              </motion.g>
            ))}
          </g>

          {/* Headlights Glow */}
          <ellipse cx="265" cy="55" rx="10" ry="15" fill="rgba(255,255,255,0.1)" filter="blur(8px)" />
        </svg>

        {/* Speed Trails */}
        <div className="absolute top-1/2 left-0 w-full h-full -translate-y-1/2 pointer-events-none opacity-20">
          {[1,2,3].map((i) => (
            <motion.div
              key={i}
              className="absolute left-0 h-px bg-red-600 w-20"
              style={{ top: `${i * 30}%` }}
              animate={{ x: [400, -200], opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
