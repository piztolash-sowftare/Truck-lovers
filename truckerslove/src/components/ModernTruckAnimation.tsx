'use client';

import { motion } from 'framer-motion';

export default function ModernTruckAnimation() {
  return (
    <div className="relative w-full h-40 flex items-center justify-center pointer-events-none select-none overflow-hidden bg-white/50 rounded-2xl mb-6 border border-slate-100">
      <motion.div
        initial={{ x: "-120%" }}
        animate={{ x: "120%" }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="flex items-end"
      >
        <svg width="320" height="100" viewBox="0 0 320 100">
          {/* --- REMORCA --- */}
          {/* Corpul principal al remorcii */}
          <rect x="10" y="20" width="190" height="50" rx="4" fill="#0ea5e9" />
          {/* Linie estetică pe lateralul remorcii */}
          <rect x="10" y="25" width="190" height="4" fill="#ffffff" opacity="0.3" />
          
          {/* CELE 3 AXE DIN SPATELE REMORCII (Poziționate corect în spate) */}
          <circle cx="140" cy="75" r="9" fill="#1e293b" />
          <circle cx="162" cy="75" r="9" fill="#1e293b" />
          <circle cx="184" cy="75" r="9" fill="#1e293b" />
          
          {/* --- CAP TRACTOR --- */}
          {/* Șasiu legătură */}
          <rect x="200" y="60" width="15" height="10" fill="#64748b" />
          
          {/* Cabină (Stil European Modern) */}
          <path d="M205 75 L205 15 L255 15 L275 40 L285 40 L290 55 L290 75 Z" fill="#ef4444" />
          
          {/* Geamuri și detalii cabină */}
          <path d="M215 22 H250 V45 H215 Z" fill="#ffffff" opacity="0.6" />
          <rect x="260" y="45" width="20" height="5" fill="#ffffff" opacity="0.3" />
          
          {/* CELE 2 AXE ALE CAPULUI TRACTOR */}
          <circle cx="215" cy="75" r="10" fill="#1e293b" />
          <circle cx="275" cy="75" r="10" fill="#1e293b" />

          {/* Lumini Faruri */}
          <circle cx="288" cy="65" r="2" fill="#fbbf24" />
        </svg>
      </motion.div>
    </div>
  );
}
