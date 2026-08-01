import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import ProfileForm from '@/components/ProfileForm';
import { Camera, Truck, Eye } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
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
    <div className="space-y-12 pb-20">
      <div className="flex flex-col items-center pt-10 px-6">
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-red-600 blur-[60px] opacity-10" />
          <div className="flex items-center gap-6 relative">
            <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
              PROFILUL <span className="text-red-600">MEU</span>
            </h2>
            {user.isAdmin && (
              <Link href="/admin" className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-black text-sm font-black px-4 py-2 rounded-2xl shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:scale-110 transition-transform animate-pulse">ADMIN A</Link>
            )}
          </div>
        </div>
        <ProfileForm user={user} />
      </div>

      <div className="px-6 space-y-6">
        <div className="bg-gradient-to-br from-red-600 to-red-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
            <Truck size={120} />
          </div>
          <h3 className="font-black text-2xl mb-3 tracking-tighter uppercase italic">TRUCKLOVERS ELITE</h3>
          <p className="text-xs opacity-90 leading-relaxed font-bold tracking-tight">
            Ești parte din cea mai exclusivistă comunitate de șoferi. Profilul tău este acum vizibil pentru mii de colegi din toată Europa.
            <br /><br />
            Menține datele actualizate pentru a primi cele mai bune potriviri pe ruta ta.
          </p>
          <div className="mt-6 flex justify-between items-center">
             <span className="text-[10px] font-black uppercase bg-white/20 px-3 py-1 rounded-full">Status: Premium</span>
             <Link href="/visitors" className="text-[10px] font-black uppercase bg-black/40 px-3 py-1 rounded-full flex items-center gap-1.5 hover:bg-black/60 transition-all">
                <Eye size={12} /> Vezi Vizitatori
             </Link>
          </div>
        </div>

        <div className="py-8 text-center border-t border-white/5">
          <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.5em]">
            Premium Experience by Piztolash
          </p>
        </div>
      </div>
    </div>
  );
}
