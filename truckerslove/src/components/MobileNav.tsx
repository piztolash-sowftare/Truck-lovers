'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Heart, MessageSquare, MapPin, User, Globe, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Heart, label: 'Dating' },
    { href: '/feed', icon: Globe, label: 'Comunitate' },
    { href: '/parking', icon: MapPin, label: 'Locații' },
    { href: '/chat', icon: Radio, label: 'Stație' },
    { href: '/messages', icon: MessageSquare, label: 'Mesaje' },
    { href: '/profile', icon: User, label: 'Profil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-100 px-1 pb-6 pt-3 flex justify-around items-center shadow-lg">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        const Icon = item.icon;
        
        return (
          <Link key={item.href} href={item.href} className="relative flex flex-col items-center gap-1 group flex-1">
            <motion.div
              whileTap={{ scale: 0.8 }}
              className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </motion.div>
            <span className={`text-[8px] font-bold ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
              {item.label}
            </span>
            {isActive && (
              <motion.div layoutId="activeNav" className="absolute -top-3 w-8 h-1 bg-blue-600 rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
