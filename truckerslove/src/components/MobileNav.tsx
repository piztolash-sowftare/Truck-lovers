'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Heart, MessageSquare, MapPin, User, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Heart, label: 'RADAR' },
    { href: '/feed', icon: Globe, label: 'FEED' },
    { href: '/parking', icon: MapPin, label: 'MAP' },
    { href: '/chat', icon: MessageSquare, label: 'RADIO' },
    { href: '/messages', icon: User, label: 'MATCH' },
  ];

  return (
    <nav className="flex-none bg-black/80 backdrop-blur-3xl border-t border-white/[0.02] flex justify-around py-3 pb-8 z-50 px-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`flex flex-col items-center gap-1 transition-all relative group`}
          >
            {isActive && (
              <motion.div 
                layoutId="nav-glow"
                className="absolute -top-3 w-10 h-10 bg-red-600/10 blur-xl rounded-full" 
              />
            )}
            <div className={`p-3 rounded-2xl transition-all duration-500 ${isActive ? 'text-red-500 scale-110 bg-white/[0.03]' : 'text-slate-700 group-hover:text-slate-400'}`}>
              <Icon size={20} strokeWidth={isActive ? 3 : 2} />
            </div>
            <span className={`text-[7px] font-black tracking-[0.3em] transition-all duration-300 ${isActive ? 'text-white opacity-100' : 'text-slate-800 opacity-40 group-hover:opacity-60'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
