import { getProfileVisitors } from '@/app/actions';
import { Eye, Clock, User, Truck } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function VisitorsPage() {
  const visitors = await getProfileVisitors();

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter">VIZITATORI</h2>
          <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.3em]">Cine s-a uitat la tine</p>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-red-600/10 flex items-center justify-center text-red-600 border border-red-500/20">
          <Eye size={28} />
        </div>
      </div>

      <div className="space-y-4">
        {visitors.length === 0 ? (
          <div className="bg-slate-900/50 rounded-[2rem] p-10 text-center border border-white/5 border-dashed">
            <User size={48} className="mx-auto text-slate-800 mb-4" />
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Niciun vizitator momentan</p>
            <p className="text-xs text-slate-600 mt-2 italic">Fii mai activ pe stație și vei atrage atenția!</p>
          </div>
        ) : (
          visitors.map((v: any) => (
            <Link 
              key={v.id} 
              href={`/profile/${v.visitor.id}`}
              className="bg-slate-900/50 border border-white/5 p-5 rounded-[2rem] flex items-center gap-4 hover:bg-slate-900 transition-all hover:border-red-500/30 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-800 overflow-hidden border-2 border-white/5 relative flex-none">
                {v.visitor.image ? (
                  <img src={v.visitor.image} alt={v.visitor.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-red-600 font-black text-xl">
                    {v.visitor.name[0]}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-white text-base truncate">{v.visitor.name}, {v.visitor.age || 30}</h3>
                  <Truck size={12} className="text-red-600" />
                </div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest truncate">{v.visitor.truckModel || 'Trucker'}</p>
                <div className="flex items-center gap-1.5 mt-2 text-slate-600">
                  <Clock size={10} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Vizitat recent</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-red-500 transition-colors">
                <ArrowRight size={18} />
              </div>
            </Link>
          ))
        )}
      </div>
      
      <div className="pt-10 text-center">
        <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.5em]">
          Premium Experience by Piztolash
        </p>
      </div>
    </div>
  );
}

function ArrowRight({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
