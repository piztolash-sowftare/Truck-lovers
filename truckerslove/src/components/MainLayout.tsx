import { getSession } from '@/lib/auth';
import AuthInterface from './AuthInterface';
import MobileNav from './MobileNav';
import { Truck, LogOut, ShieldCheck } from 'lucide-react';
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
    <div className="max-w-md mx-auto h-screen relative bg-[#0f172a] flex flex-col overflow-hidden shadow-2xl border-x border-white/5">
      <header className="flex-none bg-[#1e293b]/60 backdrop-blur-2xl border-b border-white/10 px-6 py-4 flex items-center justify-between z-40 relative">
        <div className="flex items-center gap-3">
          <Link href="/" className="relative group">
            <div className="absolute inset-0 bg-blue-600 blur-xl opacity-20 animate-pulse" />
            <div className="relative bg-gradient-to-br from-blue-500 to-indigo-700 p-2.5 rounded-2xl shadow-xl shadow-blue-600/20 group-hover:scale-110 transition-all active:scale-95">
              <Truck className="text-white" size={20} />
            </div>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-white tracking-tight leading-none uppercase italic">TRUCK<span className="text-blue-500">LOVERS</span></h1>
              {user?.isAdmin && (
                <Link href="/admin" className="bg-yellow-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow-lg animate-pulse">ADMIN A</Link>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
               <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
               <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Network Active</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell initialNotifications={notifications} />
          
          <Link href="/profile" className="relative group active:scale-90 transition-all">
            <div className="w-11 h-11 rounded-full border border-white/20 overflow-hidden bg-slate-900 ring-2 ring-blue-600/5">
              {user.image ? (
                <img src={user.image} alt="User" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-black text-blue-500">{user.name[0]}</div>
              )}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-[#1e293b] rounded-full shadow-lg" />
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar relative bg-[#0f172a]">
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
        {children}
      </main>

      <MobileNav />
    </div>
  );
}
