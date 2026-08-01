'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Heart, MessageSquare, MapPin, User, Globe, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Heart, label: 'RADAR' },
    { href: '/feed', icon: Globe, label: 'FEED' },
    { href: '/parking', icon: MapPin, label: 'HARTA' },
    { href: '/chat', icon: MessageSquare, label: 'STATIE' },
    { href: '/messages', icon: User, label: 'MATCH' },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-black/95 backdrop-blur-3xl border-t border-white/5 flex justify-around py-4 pb-8 z-50 px-2 rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        const Icon = item.icon;
        
        return (
          <Link key={item.href} href={item.href} className="relative flex flex-col items-center gap-1 group flex-1">
            <motion.div
              whileTap={{ scale: 0.8 }}
              className={`p-2.5 rounded-2xl transition-colors ${isActive ? 'bg-red-600/10 text-red-500 shadow-inner' : 'text-zinc-600'}`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              {isActive && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute inset-0 bg-red-600/5 rounded-2xl -z-10 blur-md"
                />
              )}
            </motion.div>
            <span className={`text-[8px] font-black tracking-widest ${isActive ? 'text-white' : 'text-zinc-700'}`}>
              {item.label}
            </span>
            {isActive && (
              <motion.div layoutId="activeBar" className="absolute -top-4 w-10 h-0.5 bg-red-600 rounded-full shadow-[0_0_15px_red]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
