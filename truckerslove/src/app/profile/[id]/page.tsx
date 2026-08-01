import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { Truck, MapPin, Star, Info, Briefcase, Heart, Calendar } from 'lucide-react';
import { logProfileVisit } from '@/app/actions';

export const dynamic = 'force-dynamic';

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect('/');

  const { id } = await params;
  const targetId = parseInt(id);
  
  if (targetId === session.userId) redirect('/profile');

  const user = await db.query.users.findFirst({
    where: eq(users.id, targetId),
  });

  if (!user) notFound();

  // Log the visit
  await logProfileVisit(targetId);

  const gallery = user.images ? JSON.parse(user.images) : user.image ? [user.image] : [];

  return (
    <div className="min-h-screen bg-[#020617] pb-24">
      {/* Photo Gallery Header */}
      <div className="relative h-[60vh] w-full bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10" />
        {gallery.length > 0 ? (
          <div className="flex h-full w-full overflow-x-auto snap-x no-scrollbar">
            {gallery.map((img: string, i: number) => (
              <img key={i} src={img} className="h-full w-full object-cover snap-center flex-none" />
            ))}
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-800">
            <Truck size={120} />
          </div>
        )}
        
        {gallery.length > 1 && (
          <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2 z-20">
             {gallery.map((_: any, i: number) => (
               <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/50" />
             ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-6 -mt-8 relative z-20">
        <div className="bg-[#020617] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter italic">
                {user.name}, {user.age}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-black uppercase text-red-500 bg-red-600/10 px-3 py-1 rounded-full border border-red-500/20 tracking-widest">
                  {user.role === 'driver' ? 'Șofer Profesionist' : 'Admirator'}
                </span>
              </div>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center shadow-xl shadow-red-600/20 rotate-3">
              <Truck className="text-white" size={32} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
             <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Plecare</p>
                <div className="flex items-center gap-2 text-white">
                  <MapPin size={14} className="text-red-500" />
                  <span className="text-xs font-bold">{user.routeStart || 'Nespecificat'}</span>
                </div>
             </div>
             <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Destinație</p>
                <div className="flex items-center gap-2 text-white">
                  <Truck size={14} className="text-red-500" />
                  <span className="text-xs font-bold">{user.routeEnd || 'Nespecificat'}</span>
                </div>
             </div>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest mb-4">
                <Star size={16} /> Camion & Experiență
              </h3>
              <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-tight">Model Camion</span>
                  <span className="text-xs text-white font-black">{user.truckModel || 'Pasiune Truck'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-tight">Ani pe drum</span>
                  <span className="text-xs text-white font-black">{user.experience || 'Vechime Cargo'}</span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest mb-4">
                <Info size={16} /> Biografia Mea
              </h3>
              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                <p className="text-sm text-slate-300 font-medium leading-relaxed italic">
                  "{user.bio || 'Sunt un om al soselelor în căutarea sufletului pereche. Drumuri bune tuturor!'}"
                </p>
              </div>
            </section>

            <section>
              <h3 className="flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest mb-4">
                <Heart size={16} /> Hobby-uri
              </h3>
              <div className="flex flex-wrap gap-2">
                {(user.hobbies || 'Călătorii, Muzică, Cafea').split(',').map((h, i) => (
                  <span key={i} className="bg-slate-900 border border-white/5 px-4 py-2 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {h.trim()}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
