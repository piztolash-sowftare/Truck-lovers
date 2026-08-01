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
    <>
      <header className="flex-none bg-black/60 backdrop-blur-2xl border-b border-white/[0.05] px-6 py-5 flex items-center justify-between z-40 relative">
        <div className="flex items-center gap-3">
          <Link href="/" className="relative active:scale-95 transition-transform">
            <div className="absolute inset-0 bg-red-600 blur-xl opacity-20" />
            <div className="relative bg-gradient-to-br from-red-600 to-red-800 w-11 h-11 rounded-[1.25rem] flex items-center justify-center shadow-2xl rotate-[-3deg] border border-white/10">
              <Truck className="text-white" size={24} strokeWidth={2.5} />
            </div>
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white tracking-tighter leading-none italic uppercase">TRUCK<span className="text-red-600">LOVERS</span></h1>
              {user?.isAdmin && (
                <div className="bg-gradient-to-br from-yellow-400 to-amber-600 text-black text-[7px] font-black px-1.5 py-0.5 rounded-md shadow-lg animate-pulse border border-yellow-200/50">ELITE A</div>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
               <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.4em]">Radar Active</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <NotificationBell initialNotifications={notifications} />
          
          <Link href="/profile" className="relative group active:scale-90 transition-all">
            <div className={`w-12 h-12 rounded-full p-[2px] ${user.isAdmin ? 'bg-gradient-to-br from-yellow-400 to-amber-600' : 'bg-gradient-to-br from-red-600 to-zinc-800'}`}>
                <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden border-2 border-black">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-black text-red-500">{user.name[0]}</div>
                  )}
                </div>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar relative bg-[#000]">
        <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-900/5 via-transparent to-transparent pointer-events-none" />
        {children}
      </main>
      
      <div className="h-[100px] w-full bg-transparent flex-none" />
      <MobileNav />
    </>
  );
}
