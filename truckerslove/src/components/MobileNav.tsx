'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Heart, MessageSquare, MapPin, User, Globe } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Heart, label: 'Swipe' },
    { href: '/parking', icon: MapPin, label: 'Harta' },
    { href: '/chat', icon: Globe, label: 'Stație' },
    { href: '/messages', icon: MessageSquare, label: 'Mesaje' },
    { href: '/profile', icon: User, label: 'Profil' },
  ];

  return (
    <nav className="flex-none bg-slate-950/80 backdrop-blur-2xl border-t border-white/5 flex justify-around py-4 pb-8 z-50 px-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`flex flex-col items-center gap-1.5 transition-all relative ${isActive ? 'text-red-600 scale-110' : 'text-slate-500'}`}
          >
            {isActive && (
              <div className="absolute -top-4 w-12 h-1 bg-red-600 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
            )}
            <Icon size={isActive ? 28 : 24} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
