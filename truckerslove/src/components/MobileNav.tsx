'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Heart, Users, MapPin, MessageCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Heart, label: 'Dating' },
    { href: '/feed', icon: Users, label: 'Comunitate' },
    { href: '/parking', icon: MapPin, label: 'Locații' },
    { href: '/chat', icon: MessageCircle, label: 'Stație' },
    { href: '/profile', icon: User, label: 'Profil' },
  ];

  return (
    <nav className="flex-none bg-white border-t border-gray-100 flex justify-around py-2 pb-6 z-50 px-2 shadow-lg">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`flex flex-col items-center gap-1 transition-all flex-1 py-1 ${isActive ? 'text-violet-600' : 'text-gray-400'}`}
          >
            <motion.div
              whileTap={{ scale: 0.8 }}
              className="relative p-1"
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              {isActive && (
                <motion.div 
                  layoutId="bubble"
                  className="absolute inset-0 bg-violet-100 rounded-xl -z-10"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.div>
            <span className="text-[10px] font-medium tracking-tight">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
