'use client';

import { motion } from 'framer-motion';

export default function ModernTruckAnimation() {
  return (
    <div className="relative w-72 h-36 flex items-center justify-center pointer-events-none">
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "circOut" }}
      >
        <svg viewBox="0 0 240 80" className="w-64 h-auto fill-none">
          <defs>
            <linearGradient id="truckGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff003c" />
              <stop offset="100%" stopColor="#880020" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Main Rig Outline - Ultra Sharp */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            stroke="url(#truckGrad)"
            strokeWidth="3"
            filter="url(#glow)"
            d="M20,60 L20,20 L140,20 L145,30 L220,30 L225,50 L225,60 L20,60 Z"
          />
          
          {/* Windows */}
          <path stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" d="M145,35 L170,35 L175,45 L145,45 Z" />
          
          {/* Detail Lines */}
          <line x1="20" y1="40" x2="140" y2="40" stroke="white" strokeWidth="0.5" opacity="0.1" />
          
          {/* Wheels - Animated spinning */}
          <g className="wheels">
            {[45, 75, 105, 170, 205].map((cx, i) => (
              <motion.circle
                key={i}
                cx={cx}
                cy="62"
                r="7"
                stroke="#ff003c"
                strokeWidth="2"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ))}
          </g>
        </svg>
      </motion.div>
      
      {/* Dynamic Ground Particles */}
      <div className="absolute bottom-6 left-0 right-0 h-1 overflow-hidden opacity-40">
        {[1,2,3,4,5].map((i) => (
          <motion.div
            key={i}
            className="absolute h-full w-4 bg-red-500 rounded-full"
            animate={{ x: [400, -100] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}
