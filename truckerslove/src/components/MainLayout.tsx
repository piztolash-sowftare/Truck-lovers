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
    <div className="max-w-md mx-auto h-screen relative bg-[#020617] flex flex-col overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] border-x border-white/[0.03]">
      <header className="flex-none bg-[#020617]/60 backdrop-blur-2xl border-b border-white/[0.05] px-6 py-4 flex items-center justify-between z-40 relative">
        <div className="flex items-center gap-3">
          <Link href="/" className="relative group">
            <div className="absolute inset-0 bg-red-600 blur-xl opacity-20 animate-pulse" />
            <div className="relative bg-gradient-to-br from-red-500 to-red-700 p-2.5 rounded-2xl shadow-xl shadow-red-600/20 group-hover:scale-110 transition-all active:scale-95">
              <Truck className="text-white" size={20} />
            </div>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-[-0.05em] leading-none uppercase italic">TRUCK<span className="text-red-500">LOVERS</span></h1>
              {user?.isAdmin && (
                <div className="flex items-center gap-1">
                   <div className="bg-yellow-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow-[0_0_15px_rgba(234,179,8,0.5)] animate-pulse">A</div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
               <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
               <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">System Online</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell initialNotifications={notifications} />
          
          <Link href="/profile" className="relative group active:scale-90 transition-all">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-900 rounded-2xl blur-[3px] opacity-40 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-11 h-11 rounded-[1.25rem] border border-white/20 overflow-hidden bg-slate-900 ring-2 ring-red-600/5">
              {user.image ? (
                <img src={user.image} alt="User" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-black text-red-500">{user.name[0]}</div>
              )}
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar relative bg-[#020617] selection:bg-red-500/30">
        {/* Modern Background Elements */}
        <div className="absolute top-20 -left-20 w-80 h-80 bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-20 -right-20 w-80 h-80 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
        
        {children}
      </main>

      <MobileNav />
    </div>
  );
}
