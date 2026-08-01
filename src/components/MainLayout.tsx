import { getSession } from '@/lib/auth';
import AuthInterface from './AuthInterface';
import MobileNav from './MobileNav';
import { Truck, LogOut, ShieldCheck, User } from 'lucide-react';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { logoutAction } from '@/app/actions/auth';
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
    <div className="max-w-md mx-auto h-screen relative bg-black flex flex-col overflow-hidden shadow-2xl border-x border-white/[0.02]">
      <header className="flex-none ultra-glass px-6 py-5 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <Link href="/" className="relative active:scale-95 transition-all">
            <div className="w-10 h-10 bg-gradient-to-tr from-red-600 to-red-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,31,31,0.2)]">
              <Truck className="text-white" size={20} />
            </div>
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight leading-none">TRUCK<span className="text-red-500">LOVERS</span></h1>
              {user?.isAdmin && (
                <div className="bg-[#ffb800] text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow-[0_0_15px_rgba(255,184,0,0.4)] animate-pulse border border-yellow-200/50">ELITE A</div>
              )}
            </div>
            <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1 flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-emerald-500" /> Connection Secure
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell initialNotifications={notifications} />
          <Link href="/profile" className="relative active:scale-95 transition-all">
             <div className="w-11 h-11 rounded-2xl border border-white/10 overflow-hidden bg-slate-900 ring-2 ring-red-600/5 relative group">
               {user.image ? (
                 <img src={user.image} alt="User" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-sm font-black text-red-500">{user.name[0]}</div>
               )}
               {user.isAdmin && (
                 <div className="absolute inset-0 border-2 border-yellow-500/50 rounded-2xl pointer-events-none" />
               )}
             </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-red-600/5 to-transparent pointer-events-none" />
        {children}
      </main>

      <MobileNav />
    </div>
  );
}
