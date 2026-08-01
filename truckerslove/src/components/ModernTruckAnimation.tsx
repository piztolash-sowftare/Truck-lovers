'use client';
import { motion } from 'framer-motion';

export default function ModernTruckAnimation() {
  return (
    <div className="relative w-full h-40 flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ x: "-120%" }}
        animate={{ x: "120%" }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="flex items-end"
      >
        <svg width="320" height="100" viewBox="0 0 320 100">
          {/* --- REMORCA --- */}
          {/* Corpul principal al remorcii */}
          <rect x="10" y="20" width="190" height="50" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          {/* Linie estetică pe lateralul remorcii */}
          <rect x="10" y="25" width="190" height="4" fill="#ff385c" opacity="0.6" />
          
          {/* CELE 3 AXE DIN SPATELE REMORCII (Poziționate corect în spate) */}
          <circle cx="35" cy="75" r="9" fill="#000" stroke="#475569" strokeWidth="2"/>
          <circle cx="60" cy="75" r="9" fill="#000" stroke="#475569" strokeWidth="2"/>
          <circle cx="85" cy="75" r="9" fill="#000" stroke="#475569" strokeWidth="2"/>
          
          {/* --- CAP TRACTOR --- */}
          {/* Șasiu legătură */}
          <rect x="200" y="60" width="15" height="10" fill="#334155" />
          
          {/* Cabină (Stil European Modern) */}
          <path d="M205 75 L205 15 L255 15 L275 40 L285 40 L290 55 L290 75 Z" fill="#ff385c" />
          
          {/* Geamuri și detalii cabină */}
          <path d="M215 22 H250 V45 H215 Z" fill="#0f172a" opacity="0.8" />
          <rect x="260" y="45" width="20" height="5" fill="#0f172a" opacity="0.5" />
          
          {/* CELE 2 AXE ALE CAPULUI TRACTOR */}
          <circle cx="220" cy="75" r="10" fill="#000" stroke="#475569" strokeWidth="2"/>
          <circle cx="270" cy="75" r="10" fill="#000" stroke="#475569" strokeWidth="2"/>

          {/* Lumini Faruri */}
          <circle cx="288" cy="65" r="2" fill="#fff" />
        </svg>
      </motion.div>
    </div>
  );
}
