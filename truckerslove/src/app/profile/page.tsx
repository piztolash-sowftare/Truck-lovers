import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import ProfileForm from '@/components/ProfileForm';
import { Truck, Star, LogOut, ShieldCheck, Mail, Calendar, UserCheck } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect('/');

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
  });

  if (!user) return <div className="p-10 text-center font-black">Utilizator negăsit.</div>;

  return (
    <div className="space-y-10 pb-32 animate-slide-up">
      {/* Profile Info Header */}
      <div className="relative px-6 pt-12 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-600/5 blur-[80px] rounded-full" />
        
        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase relative z-10">
          Setări <span className="text-red-600">Profil</span>
        </h2>
        <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.5em] mt-2 mb-10">Configurare Cont Premium</p>

        <ProfileForm user={user} />
      </div>

      <div className="px-6 space-y-6">
        <div className="bg-gradient-to-br from-red-600/10 to-transparent p-10 rounded-[3rem] border border-red-600/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:rotate-12 transition-transform duration-700">
             <Truck size={150} />
          </div>
          <div className="flex items-center gap-3 mb-4">
             <ShieldCheck className="text-red-500" size={24} />
             <h3 className="text-xl font-black text-white italic tracking-tighter">TRUCKLOVERS ELITE</h3>
          </div>
          <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
            Calitate superioară garantată. Profilul tău este verificat și gata de drum pe cele mai circulate rute ale Europei.
          </p>
          <div className="mt-8 flex justify-between items-center">
             <span className="text-[10px] font-black text-red-500 bg-red-500/10 px-4 py-1.5 rounded-xl border border-red-500/20">MEMBRU PREMIUM</span>
             {user.isAdmin && <Link href="/admin" className="text-[10px] font-black text-yellow-500 bg-yellow-500/10 px-4 py-1.5 rounded-xl border border-yellow-500/20">PANOU ADMIN</Link>}
          </div>
        </div>

        <form action={logoutAction} className="w-full">
           <button type="submit" className="w-full bg-white/5 border border-white/5 hover:bg-red-600/10 hover:border-red-600/20 text-slate-400 hover:text-red-500 font-black py-6 rounded-[2rem] transition-all flex items-center justify-center gap-3 uppercase text-[10px] tracking-[0.3em]">
              <LogOut size={20} />
              Ieșire Securizată
           </button>
        </form>
      </div>

      <div className="py-10 text-center border-t border-white/[0.02]">
         <p className="text-[9px] text-slate-800 font-black uppercase tracking-[0.6em]">
           Premium Experience by Piztolash
         </p>
      </div>
    </div>
  );
}
