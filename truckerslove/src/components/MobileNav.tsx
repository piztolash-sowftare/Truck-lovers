'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Heart, MessageSquare, MapPin, User, Globe, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Heart, label: 'Radar' },
    { href: '/feed', icon: Globe, label: 'Feed' },
    { href: '/parking', icon: MapPin, label: 'Hartă' },
    { href: '/chat', icon: MessageSquare, label: 'Stație' },
    { href: '/messages', icon: User, label: 'Matches' },
  ];

  return (
    <nav className="flex-none bg-[#020617]/90 backdrop-blur-3xl border-t border-white/[0.03] flex justify-around py-4 pb-8 z-50 px-2 shadow-[0_-10px_40px_rgba(0,0,0,0.6)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`flex flex-col items-center gap-1 transition-all relative ${isActive ? 'text-red-500' : 'text-slate-600 hover:text-slate-400'}`}
          >
            {isActive && (
              <motion.div 
                layoutId="nav-indicator"
                className="absolute -top-[1.1rem] w-8 h-0.5 bg-red-600 rounded-full shadow-[0_0_15px_rgba(239,68,68,1)]" 
              />
            )}
            <div className={`p-2.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-red-500/10 scale-110' : 'scale-100'}`}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[8px] font-black uppercase tracking-[0.2em] transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-30'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
