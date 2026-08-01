'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Heart, MessageSquare, MapPin, User, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Heart, label: 'RADAR' },
    { href: '/feed', icon: Globe, label: 'SITUAȚII' },
    { href: '/parking', icon: MapPin, label: 'HARTĂ' },
    { href: '/chat', icon: MessageSquare, label: 'RADIO' },
    { href: '/messages', icon: User, label: 'MESAJE' },
  ];

  return (
    <nav className="flex-none bg-white/95 backdrop-blur-xl border-t border-slate-100 flex justify-around py-4 pb-8 z-50 px-4 shadow-[0_-10px_50px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.href} 
            href={item.href} 
            className="flex flex-col items-center gap-1 relative group active:scale-90 transition-transform"
          >
            <div className={`p-2.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'text-slate-400 group-hover:text-slate-600'}`}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[7px] font-black tracking-widest mt-1 ${isActive ? 'text-slate-900' : 'text-slate-400 opacity-60'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
