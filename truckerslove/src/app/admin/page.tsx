import { getAllUsers, deleteUser, adminDeletePhoto } from '@/app/actions';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Truck, Trash2, ShieldCheck, UserX, ImageOff, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect('/');

  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
  });

  if (!currentUser?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center">
        <ShieldCheck size={64} className="text-red-900 mb-6 opacity-20" />
        <h1 className="text-2xl font-black text-white italic">ACCES RESTRICȚIONAT</h1>
        <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">Doar adminii TruckLovers au acces aici.</p>
        <Link href="/" className="mt-8 premium-btn px-8">ÎNAPOI LA RADAR</Link>
      </div>
    );
  }

  const allUsers = await getAllUsers();

  return (
    <div className="p-6 space-y-10 pb-32">
      <div className="flex items-center justify-between bg-gradient-to-r from-yellow-500/10 to-transparent p-6 rounded-[2rem] border border-yellow-500/20">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter flex items-center gap-3">
            DASHBOARD ADMIN <span className="text-yellow-500 bg-yellow-500/20 px-3 py-1 rounded-xl text-lg not-italic">A</span>
          </h1>
          <p className="text-[10px] text-yellow-500 font-black uppercase tracking-[0.3em] mt-1">Control Total TruckLovers Elite</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] px-2 flex items-center justify-between">
          <span>Utilizatori Înregistrați ({allUsers.length})</span>
        </h2>
        
        {allUsers.map((u: any) => (
          <div key={u.id} className="bg-slate-900/50 border border-white/5 p-6 rounded-[2.5rem] space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 overflow-hidden border-2 border-white/5">
                   {u.image ? <img src={u.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-red-500 font-black text-xl">{u.name[0]}</div>}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">{u.name}, {u.age} {u.isAdmin && <span className="text-yellow-500 text-xs ml-1">★ Admin</span>}</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{u.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                 <Link href={`/profile/${u.id}`} className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all border border-white/5">
                    <ExternalLink size={18} />
                 </Link>
                 <form action={async () => { 'use server'; await deleteUser(u.id); }}>
                    <button className="p-3 bg-red-600/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-600 hover:text-white transition-all group">
                       <UserX size={18} className="group-hover:scale-110 transition-transform" />
                    </button>
                 </form>
              </div>
            </div>

            {u.images && (
              <div className="space-y-3">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-1">Gestiune Galerie (Admin)</p>
                <div className="grid grid-cols-6 gap-2">
                  {JSON.parse(u.images).map((img: string, i: number) => (
                    <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-white/5">
                       <img src={img} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
                       <form action={async () => { 'use server'; await adminDeletePhoto(u.id, i); }}>
                          <button className="absolute inset-0 flex items-center justify-center bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-all">
                             <Trash2 size={12} />
                          </button>
                       </form>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
