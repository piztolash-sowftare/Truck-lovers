import { getAllUsers, deleteUser, adminDeletePhoto, getGlobalMessages, adminDeleteGlobalMessage, adminClearAllMessages } from '@/app/actions';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Trash2, ShieldCheck, UserX, ExternalLink, Truck } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect('/');

  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
  });

  if (!currentUser?.isAdmin) {
    redirect('/');
  }

  const allUsers = await getAllUsers();
  const globalMsgs = await getGlobalMessages();

  return (
    <div className="p-6 space-y-12 pb-32 animate-slide-up">
      <div className="flex items-center justify-between bg-gradient-to-br from-[#ffb800]/10 via-black to-transparent p-10 rounded-[3.5rem] border border-yellow-500/20 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:rotate-12 transition-transform duration-1000">
           <Truck size={200} />
        </div>
        <div className="z-10">
          <h1 className="text-5xl font-black text-white italic tracking-tighter flex items-center gap-4">
            ELITE <span className="text-[#ffb800]">COMMAND</span>
          </h1>
          <p className="text-[10px] text-yellow-500 font-black uppercase tracking-[0.6em] mt-3">Level 1 Security Authorization</p>
        </div>
        <div className="w-20 h-20 rounded-[2.5rem] bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-black text-4xl shadow-[0_0_50px_rgba(234,179,8,0.4)] z-10 animate-pulse border-2 border-yellow-200/50">
          A
        </div>
      </div>

      {/* Users Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
           <div className="w-1.5 h-6 bg-red-600 rounded-full" />
           <h2 className="text-xs font-black text-white uppercase tracking-[0.3em]">Utilizatori ({allUsers.length})</h2>
        </div>
        
        <div className="grid gap-6">
          {allUsers.map((u: any) => (
            <div key={u.id} className="bg-[#020617] border border-white/5 p-6 rounded-[2.5rem] shadow-xl group hover:border-red-600/20 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-white/5 overflow-hidden shadow-lg relative">
                    {u.image ? <img src={u.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-red-500 font-black text-xl">{u.name[0]}</div>}
                    {u.isAdmin && <div className="absolute top-0 right-0 bg-yellow-500 w-4 h-4 rounded-bl-lg flex items-center justify-center text-black text-[8px] font-black">A</div>}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white leading-none">{u.name}, {u.age}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">{u.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <Link href={`/profile/${u.id}`} className="p-3.5 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-all border border-white/5">
                      <ExternalLink size={18} />
                   </Link>
                   {!u.isAdmin && (
                     <form action={async () => { 'use server'; await deleteUser(u.id); }}>
                        <button className="p-3.5 bg-red-600/10 border border-red-500/20 rounded-2xl text-red-500 hover:bg-red-600 hover:text-white transition-all">
                           <UserX size={18} />
                        </button>
                     </form>
                   )}
                </div>
              </div>

              {u.images && (
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-1">Galerie Utilizator</p>
                  <div className="grid grid-cols-6 gap-2">
                    {JSON.parse(u.images).map((img: string, i: number) => (
                      <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-white/5 bg-slate-900">
                         <img src={img} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" />
                         <form action={async () => { 'use server'; await adminDeletePhoto(u.id, i); }} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                            <button className="w-full h-full bg-red-600/80 text-white flex items-center justify-center">
                               <Trash2 size={16} />
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

      {/* Messages Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-yellow-500 rounded-full" />
              <h2 className="text-xs font-black text-white uppercase tracking-[0.3em]">Stație Globală</h2>
           </div>
           <form action={async () => { 'use server'; await adminClearAllMessages(); }}>
              <button className="text-[8px] font-black text-red-500 uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">Șterge Tot Chatul</button>
           </form>
        </div>
        
        <div className="bg-[#020617] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="max-h-96 overflow-y-auto custom-scrollbar p-4 space-y-4">
            {globalMsgs.map((msg: any) => (
              <div key={msg.id} className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5 group">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex-none flex items-center justify-center text-red-500 font-black text-xs">
                    {msg.user.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-white truncate">{msg.user.name}</p>
                    <p className="text-xs text-slate-400 font-medium truncate">{msg.content}</p>
                  </div>
                </div>
                <form action={async () => { 'use server'; await adminDeleteGlobalMessage(msg.id); }}>
                  <button className="p-2 text-slate-700 hover:text-red-500 transition-all">
                    <Trash2 size={16} />
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
