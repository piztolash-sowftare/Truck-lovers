import { getSession } from '@/lib/auth';
import AuthInterface from './AuthInterface';
import MobileNav from './MobileNav';
import { Truck } from 'lucide-react';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getNotifications } from '@/app/actions';
import Link from 'next/link';
import NotificationBell from './NotificationBell';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  let user = null;
  let notifications: any[] = [];

  if (session) {
    try {
      user = await db.query.users.findFirst({
        where: eq(users.id, session.userId),
      });
      notifications = await getNotifications();
    } catch (e) {
      console.error('MainLayout data fetch failed:', e);
    }
  }

  if (!user) {
    return <AuthInterface />;
  }

  return (
    <div className="max-w-md mx-auto h-screen relative bg-black flex flex-col overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] border-x border-white/[0.03]">
      <header className="flex-none glass-card mx-4 my-4 px-6 py-4 rounded-[2rem] flex items-center justify-between z-50 relative">
        <div className="flex items-center gap-3">
          <Link href="/" className="relative active:scale-90 transition-transform">
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-2xl rotate-[-3deg]">
              <Truck className="text-black" size={20} strokeWidth={3} />
            </div>
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-[-0.03em] leading-none uppercase">Truck<span className="text-[#ff003c]">Lovers</span></h1>
              {user?.isAdmin && (
                <div className="bg-[#ffcc00] text-black text-[7px] font-black px-1.5 py-0.5 rounded-full shadow-[0_0_15px_rgba(255,204,0,0.5)]">ELITE A</div>
              )}
            </div>
            <span className="text-[6px] font-black text-slate-500 uppercase tracking-[0.5em] mt-1 italic">Obsidian Edition</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell initialNotifications={notifications} />
          
          <Link href="/profile" className="relative group active:scale-90 transition-all">
            <div className={`w-11 h-11 rounded-full overflow-hidden bg-zinc-900 ${user.isAdmin ? 'admin-gold-ring' : 'avatar-ring'}`}>
              {user.image ? (
                <img src={user.image} alt="User" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-black text-white">{user.name[0]}</div>
              )}
            </div>
            <div className="online-indicator absolute bottom-0 right-0" />
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar relative px-4">
        {children}
      </main>

      <MobileNav />
    </div>
  );
}
