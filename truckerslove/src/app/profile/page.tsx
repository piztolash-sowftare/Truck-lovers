import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import ProfileForm from '@/components/ProfileForm';
import { Truck, Eye, LogOut, ShieldCheck, Settings, MapPin, Star } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { logoutAction } from '@/app/actions/auth';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect('/');

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
  });

  if (!user) return <div className="p-10 text-center font-black">Utilizator negăsit.</div>;

  return (
    <div className="space-y-8 pb-32 animate-slide-up">
      {/* Header Profile */}
      <div className="px-6 pt-10 flex flex-col items-center">
        <div className="relative mb-6">
          <div className="w-36 h-40 rounded-[3rem] border-4 border-white/5 bg-slate-900 overflow-hidden relative shadow-2xl">
            {user.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-red-600 font-black text-6xl">{user.name[0]}</div>
            )}
            {user.isAdmin && (
              <div className="absolute top-0 right-0 bg-yellow-500 text-black px-3 py-1 rounded-bl-3xl font-black text-xs shadow-lg">ADMIN</div>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-red-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white border-4 border-black shadow-xl">
             <Star size={20} fill="white" />
          </div>
        </div>
        
        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">{user.name}, {user.age}</h2>
        <div className="flex items-center gap-2 mt-2">
           <div className="flex items-center gap-1.5 px-3 py-1 bg-red-600/10 border border-red-500/20 rounded-full">
              <Truck size={10} className="text-red-500" />
              <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">{user.role === 'driver' ? 'Șofer Profesionist' : 'Admirator'}</span>
           </div>
        </div>
      </div>

      {/* Action Grid */}
      <div className="px-6 grid grid-cols-2 gap-4">
        <Link href="/visitors" className="ultra-glass p-6 rounded-[2.5rem] flex flex-col items-center gap-3 active:scale-95 transition-all group">
           <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-red-500 group-hover:bg-red-500/10 transition-all">
              <Eye size={24} />
           </div>
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Vizitatori</span>
        </Link>
        <div className="ultra-glass p-6 rounded-[2.5rem] flex flex-col items-center gap-3 active:scale-95 transition-all group">
           <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-yellow-500 group-hover:bg-yellow-500/10 transition-all">
              <Star size={24} />
           </div>
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Status Gold</span>
        </div>
      </div>

      {/* Profile Form (Edit Section) */}
      <div className="px-6">
        <div className="ultra-glass p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
             <Settings size={150} />
          </div>
          <div className="flex items-center gap-3 mb-10 px-2 relative z-10">
             <div className="w-1.5 h-6 bg-red-600 rounded-full" />
             <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">Configurează-ți Profilul</h3>
          </div>
          <ProfileForm user={user} />
        </div>
      </div>

      {/* Logout & Manifest Section */}
      <div className="px-6 space-y-6">
        <div className="bg-gradient-to-br from-red-600 to-red-950 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
             <Truck size={120} />
          </div>
          <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-2">TruckLovers Premium</h3>
          <p className="text-xs font-bold opacity-80 leading-relaxed uppercase tracking-widest">Experiența supremă pentru regi și regine.</p>
        </div>

        <form action={logoutAction} className="w-full">
           <button type="submit" className="w-full btn-secondary py-5 bg-white/5 border-white/10 hover:bg-red-900/20 hover:border-red-900/30 hover:text-red-500">
              <LogOut size={20} />
              Ieșire din Cont
           </button>
        </form>
      </div>

      <div className="py-10 text-center">
         <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.6em]">
           Premium Experience by Piztolash
         </p>
      </div>
    </div>
  );
}
