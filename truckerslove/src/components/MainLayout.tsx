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
    <div className="max-w-md mx-auto h-screen relative bg-black flex flex-col overflow-hidden shadow-2xl border-x border-white/[0.04]">
      <header className="flex-none glass-header px-6 py-5 flex items-center justify-between z-50 relative">
        <div className="flex items-center gap-3">
          <Link href="/" className="relative active:scale-90 transition-transform">
            <div className="absolute inset-0 bg-red-500 blur-xl opacity-20" />
            <div className="relative bg-gradient-to-br from-[#ff385c] to-[#bd1e59] w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20 rotate-[-4deg]">
              <Truck className="text-white" size={20} strokeWidth={2.5} />
            </div>
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white tracking-tight italic leading-none">TRUCK<span className="text-[#ff385c]">LOVERS</span></h1>
              {user?.isAdmin && (
                <div className="bg-gradient-to-r from-[#ffb800] to-[#ff8a00] text-black text-[7px] font-black px-1.5 py-0.5 rounded shadow-[0_0_15px_rgba(255,184,0,0.3)] border border-yellow-200/50">ELITE A</div>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
               <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]" />
               <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.4em]">Connected</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell initialNotifications={notifications} />
          
          <Link href="/profile" className="relative group active:scale-90 transition-all">
            <div className={`w-11 h-11 rounded-full border-2 border-white/10 overflow-hidden bg-slate-900 shadow-xl ring-2 ${user.isAdmin ? 'ring-yellow-500/50' : 'ring-red-500/5'} relative`}>
              {user.image ? (
                <img src={user.image} alt="User" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-black text-red-500">{user.name[0]}</div>
              )}
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar relative bg-black">
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-red-600/5 to-transparent pointer-events-none" />
        {children}
      </main>

      <MobileNav />
    </div>
  );
}
