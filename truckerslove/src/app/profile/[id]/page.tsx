import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { Truck, MapPin, Star, Info, Briefcase, Heart, Calendar, MessageCircle, ShieldAlert, ArrowLeft } from 'lucide-react';
import { logProfileVisit, getMatches } from '@/app/actions';
import Link from 'next/link';
import ProfileActions from '@/components/ProfileActions';

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

  // Check if it's a match
  const matches = await getMatches();
  const isMatch = matches.some((m: any) => m.otherUser?.id === targetId);

  // Log the visit
  await logProfileVisit(targetId);

  const gallery = user.images ? JSON.parse(user.images) : user.image ? [user.image] : [];

  return (
    <div className="min-h-screen bg-[#020617] pb-32">
      {/* Photo Gallery Header */}
      <div className="relative h-[70vh] w-full bg-slate-950">
        <Link 
          href="/messages" 
          className="absolute top-6 left-6 z-30 w-12 h-12 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-all shadow-2xl"
        >
          <ArrowLeft size={22} strokeWidth={3} />
        </Link>

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
        
        <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-2 z-20">
           {(gallery.length > 1 ? gallery : [1]).map((_: any, i: number) => (
             <div key={i} className={`h-1 rounded-full transition-all ${gallery.length > 1 ? 'w-8 bg-white/50' : 'w-12 bg-red-600'}`} />
           ))}
        </div>
      </div>

      {/* Profile Actions Sticky Bar */}
      <div className="px-6 -mt-6 relative z-30 mb-8">
        <div className="bg-slate-900/80 backdrop-blur-2xl p-4 rounded-[2rem] border border-white/10 shadow-2xl">
          <ProfileActions targetId={targetId} isMatch={isMatch} />
        </div>
      </div>

      {/* Content */}
      <div className="px-6 space-y-6">
        <div className="bg-[#020617] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
            <Truck size={200} />
          </div>

          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-5xl font-black text-white tracking-tight italic leading-none">
                  {user.name}, {user.age}
                </h1>
                {user.isAdmin && (
                   <div className="bg-gradient-to-br from-yellow-400 to-[#ff8a00] text-black text-[11px] font-black px-2.5 py-1 rounded-lg shadow-[0_0_20px_rgba(255,184,0,0.4)] border border-yellow-200/50">ELITE A</div>
                )}
              </div>
              <div className="flex items-center gap-3 mt-5">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full">
                  <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[8px] font-black uppercase text-red-500 tracking-[0.25em]">
                    {user.role === 'driver' ? 'Șofer Profesionist' : 'Premium Fan'}
                  </span>
                </div>
                {/* Online Indicator */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]" />
                  <span className="text-[8px] font-black uppercase text-emerald-500 tracking-[0.25em]">Online Acum</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
             <div className="bg-white/[0.02] border border-white/5 p-5 rounded-[2rem] group hover:border-red-500/30 transition-all">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2 px-1">Plecare</p>
                <div className="flex items-center gap-3 text-white">
                  <div className="w-8 h-8 rounded-xl bg-red-600/10 flex items-center justify-center text-red-500">
                    <MapPin size={16} />
                  </div>
                  <span className="text-sm font-black">{user.routeStart || 'Nespecificat'}</span>
                </div>
             </div>
             <div className="bg-white/[0.02] border border-white/5 p-5 rounded-[2rem] group hover:border-red-500/30 transition-all">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-2 px-1">Destinație</p>
                <div className="flex items-center gap-3 text-white">
                  <div className="w-8 h-8 rounded-xl bg-red-600/10 flex items-center justify-center text-red-500">
                    <Truck size={16} />
                  </div>
                  <span className="text-sm font-black">{user.routeEnd || 'Nespecificat'}</span>
                </div>
             </div>
          </div>

          <div className="space-y-10">
            <section>
              <div className="flex items-center gap-3 mb-6 px-1">
                <div className="w-1.5 h-6 bg-red-600 rounded-full" />
                <h3 className="text-red-500 font-black text-xs uppercase tracking-[0.3em]">Logistică & Garaj</h3>
              </div>
              <div className="bg-white/[0.02] p-6 rounded-[2.5rem] border border-white/5 space-y-5">
                <div className="flex justify-between items-center group">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-widest group-hover:text-slate-300 transition-colors">Model Camion</span>
                  <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-white/5">
                    <Truck size={14} className="text-red-600" />
                    <span className="text-xs text-white font-black uppercase tracking-tighter">{user.truckModel || 'Trucker'}</span>
                  </div>
                </div>
                <div className="h-px bg-white/5" />
                <div className="flex justify-between items-center group">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-widest group-hover:text-slate-300 transition-colors">Experiență</span>
                  <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-white/5">
                    <Star size={14} className="text-yellow-500" />
                    <span className="text-xs text-white font-black uppercase tracking-tighter">{user.experience || 'Newcomer'}</span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6 px-1">
                <div className="w-1.5 h-6 bg-red-600 rounded-full" />
                <h3 className="text-red-500 font-black text-xs uppercase tracking-[0.3em]">Povestea mea</h3>
              </div>
              <div className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5 relative">
                <div className="absolute top-0 left-0 p-4 text-4xl text-white/5 font-serif">"</div>
                <p className="text-base text-slate-300 font-medium leading-relaxed italic relative z-10 px-2">
                  {user.bio || 'Sunt un suflet liber pe roți, căutând acea conexiune specială care să facă fiecare kilometru să conteze. Drumuri bune și inimi pline!'}
                </p>
                <div className="absolute bottom-0 right-0 p-4 text-4xl text-white/5 font-serif">"</div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6 px-1">
                <div className="w-1.5 h-6 bg-red-600 rounded-full" />
                <h3 className="text-red-500 font-black text-xs uppercase tracking-[0.3em]">Hobby-uri</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {(user.hobbies || 'Călătorii, Muzică, Cafea, Pescuit').split(',').map((h, i) => (
                  <span key={i} className="bg-slate-900 border border-white/5 px-6 py-3 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest hover:border-red-600/30 transition-all">
                    {h.trim()}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="py-12 text-center">
           <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.6em]">
             Premium Experience by Piztolash
           </p>
        </div>
      </div>
    </div>
  );
}
