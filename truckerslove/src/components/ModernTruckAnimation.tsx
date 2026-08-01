'use client';

import { motion } from 'framer-motion';

export default function ModernTruckAnimation() {
  return (
    <div className="relative w-full h-40 flex items-center justify-center pointer-events-none select-none overflow-hidden">
      <motion.div
        initial={{ x: -400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "circOut" }}
        className="relative"
      >
        <svg viewBox="0 0 300 100" className="w-80 h-auto fill-none">
          <defs>
            <linearGradient id="truckPaint" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff385c" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
          </defs>
          
          {/* Trailer (5 AXES TOTAL = 2 Tractor + 3 Trailer -> User wants 5 axles total) */}
          {/* Correction: 1 wheel removed from trailer as requested */}
          <rect x="20" y="20" width="160" height="50" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
          <path d="M20,25 L180,25" stroke="#cbd5e1" strokeWidth="0.5" />
          
          {/* Tractor (Captractor) */}
          <path fill="url(#truckPaint)" d="M185,70 L185,35 L215,35 L230,45 L250,45 L255,55 L255,70 Z" />
          <path fill="white" fillOpacity="0.2" d="M220,38 L240,38 L245,45 L220,45 Z" />

          {/* Wheels - Adjusted to 5 AXLES (2 on Tractor, 2 on Trailer) */}
          <g>
            {/* Trailer Wheels (2 now) */}
            {[50, 130].map((cx, i) => (
              <motion.g key={`t-${i}`}>
                <circle cx={cx} cy="75" r="10" fill="#1e293b" />
                <motion.circle 
                  cx={cx} cy="75" r="6" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeDasharray="4 4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                />
              </motion.g>
            ))}
            {/* Tractor Wheels (2) */}
            {[200, 235].map((cx, i) => (
              <motion.g key={`c-${i}`}>
                <circle cx={cx} cy="75" r="10" fill="#1e293b" />
                <motion.circle 
                  cx={cx} cy="75" r="6" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeDasharray="4 4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                />
              </motion.g>
            ))}
          </g>
        </svg>

        {/* Speed lines */}
        <div className="absolute top-1/2 left-0 w-full h-full -translate-y-1/2 pointer-events-none opacity-40">
          {[1,2,3].map((i) => (
            <motion.div
              key={i}
              className="absolute left-0 h-0.5 bg-sky-400 w-16"
              style={{ top: `${i * 30}%` }}
              animate={{ x: [500, -200], opacity: [0, 1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "linear", delay: i * 0.1 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
