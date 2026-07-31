import { getSession } from '@/lib/auth';
import AuthInterface from './AuthInterface';
import MobileNav from './MobileNav';
import { Truck } from 'lucide-react';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

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
    <div className="max-w-md mx-auto h-screen relative bg-slate-950 flex flex-col overflow-hidden shadow-2xl">
      <header className="flex-none bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          <div className="bg-red-600 p-1.5 rounded-lg">
            <Truck className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-black text-white tracking-tighter">TRUCKLOVERS</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
             <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Premium</span>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">by piztolash</span>
          </div>
          <div className="w-8 h-8 rounded-full border-2 border-red-600/30 overflow-hidden bg-slate-800">
            {user.image ? <img src={user.image} alt="User" /> : <div className="w-full h-full flex items-center justify-center text-xs font-black text-red-500">{user.name[0]}</div>}
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
