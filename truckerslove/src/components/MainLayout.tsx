import { getSession } from '@/lib/auth';
import AuthInterface from './AuthInterface';
import MobileNav from './MobileNav';
import { Truck, LogOut, ShieldCheck } from 'lucide-react';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { logoutAction } from '@/app/actions/auth';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  let user = null;

  if (session) {
    user = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
    });
  }

  if (!user) {
    return <AuthInterface />;
  }

  return (
    <div className="max-w-md mx-auto h-screen relative bg-[#020617] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)] border-x border-white/5">
      <header className="flex-none bg-[#020617]/40 backdrop-blur-2xl border-b border-white/[0.03] px-6 py-5 flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-red-600 blur-md opacity-20 animate-pulse" />
            <div className="relative bg-gradient-to-br from-red-500 to-red-700 p-2 rounded-xl shadow-lg shadow-red-600/20">
              <Truck className="text-white" size={18} />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-[-0.05em] leading-none uppercase italic">TRUCK<span className="text-red-500">LOVERS</span></h1>
            <div className="flex items-center gap-1 mt-0.5">
               <ShieldCheck size={8} className="text-red-500" />
               <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Verified Elite</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <form action={logoutAction}>
            <button className="text-slate-500 hover:text-red-500 transition-colors p-2 bg-white/5 rounded-xl border border-white/5 group">
              <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-900 rounded-full blur-[2px] opacity-30" />
            <div className="relative w-10 h-10 rounded-full border border-white/20 overflow-hidden bg-slate-900 ring-2 ring-red-600/10">
              {user.image ? (
                <img src={user.image} alt="User" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-black text-red-500">{user.name[0]}</div>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto custom-scrollbar relative bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
