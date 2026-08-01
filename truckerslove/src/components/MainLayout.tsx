import { getSession } from '@/lib/auth';
import AuthInterface from './AuthInterface';
import MobileNav from './MobileNav';
import { Truck, Bell, ShieldCheck } from 'lucide-react';
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
    <div className="max-w-md mx-auto h-screen relative bg-slate-50 flex flex-col overflow-hidden shadow-2xl border-x border-black/[0.05]">
      {/* 2026 Light Blue Premium Header */}
      <header className="flex-none bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center justify-between z-40 relative">
        <div className="flex items-center gap-3">
          <Link href="/" className="relative active:scale-90 transition-all">
            <div className="bg-[#ff385c] p-2.5 rounded-2xl shadow-lg shadow-red-100">
              <Truck className="text-white" size={20} strokeWidth={2.5} />
            </div>
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none italic">TRUCK<span className="text-[#ff385c]">LOVERS</span></h1>
              {user?.isAdmin && (
                <div className="bg-[#ffcc00] text-black text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-md border border-white/20 animate-pulse">ADMIN A</div>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
               <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,1)]" />
               <span className="text-[7px] font-black text-slate-400 uppercase tracking-[0.3em]">Full Access</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell initialNotifications={notifications} />
          
          <Link href="/profile" className="relative group active:scale-90 transition-all">
            <div className={`w-11 h-11 rounded-full border-2 border-white shadow-xl overflow-hidden bg-slate-100 ${user.isAdmin ? 'ring-2 ring-yellow-400' : 'ring-2 ring-slate-100'}`}>
              {user.image ? (
                <img src={user.image} alt="User" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-black text-slate-300">{user.name[0]}</div>
              )}
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar relative bg-[#f8fafc]">
        {/* Sky Blue Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-sky-500/5 to-transparent pointer-events-none" />
        {children}
      </main>

      <MobileNav />
    </div>
  );
}
