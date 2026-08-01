import { getMatches } from '@/app/actions';
import { MessageSquare, Heart, Truck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  const matches = await getMatches();

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter">MESAJE</h2>
          <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.3em]">Perechile Tale de Drum</p>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-red-600/10 flex items-center justify-center text-red-600 border border-red-500/20">
          <MessageSquare size={28} />
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="bg-slate-900/50 rounded-[2.5rem] p-12 text-center border border-white/5 border-dashed">
          <div className="w-20 h-20 rounded-full bg-slate-900 mx-auto flex items-center justify-center mb-6 shadow-2xl border border-white/5">
            <Heart size={40} className="text-slate-800" />
          </div>
          <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-2">Drum Liber...</h3>
          <p className="text-xs text-slate-500 font-medium mb-8 leading-relaxed italic">Nu ai încă nicio pereche. Glisează pe radar și caută-ți partenerul!</p>
          <Link href="/" className="premium-btn py-4 inline-flex px-8">
            PORNEȘTE RADARUL
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((m: any) => (
            <Link 
              key={m.id} 
              href={`/messages/${m.id}`}
              className="bg-slate-900/50 border border-white/5 p-5 rounded-[2rem] flex items-center gap-4 hover:bg-slate-900 transition-all hover:border-red-500/30 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-800 overflow-hidden border-2 border-white/5 relative flex-none shadow-xl ring-2 ring-red-600/10">
                {m.otherUser?.image ? (
                  <img src={m.otherUser.image} alt={m.otherUser.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-red-600 font-black text-xl bg-slate-900">
                    {m.otherUser?.name?.[0]}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-slate-950 rounded-full shadow-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-black text-white text-base truncate">{m.otherUser?.name}, {m.otherUser?.age}</h3>
                  <Truck size={12} className="text-red-600" />
                </div>
                <p className="text-xs text-slate-500 font-bold truncate italic">
                  {m.lastMsg ? m.lastMsg.content : 'Spune-i ceva frumos...'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-red-500 transition-colors">
                <ArrowRight size={18} />
              </div>
            </Link>
          ))}
        </div>
      )}
      
      <div className="pt-10 text-center opacity-50">
        <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.5em]">
          Premium Experience by Piztolash
        </p>
      </div>
    </div>
  );
}
