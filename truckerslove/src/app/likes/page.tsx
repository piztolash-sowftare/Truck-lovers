import { getReceivedLikes } from '@/app/actions';
import { Heart, Truck, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function LikesPage() {
  const likes = await getReceivedLikes();

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter">TE PLAC</h2>
          <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.3em]">Colegi care ți-au dat Like</p>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-red-600/10 flex items-center justify-center text-red-600 border border-red-500/20">
          <Heart size={28} fill="currentColor" />
        </div>
      </div>

      <div className="space-y-4">
        {likes.length === 0 ? (
          <div className="bg-slate-900/50 rounded-[2.5rem] p-12 text-center border border-white/5 border-dashed">
            <Star size={48} className="mx-auto text-slate-800 mb-6" />
            <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-2">E liniște...</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed italic uppercase tracking-widest">Continuă să conduci și cineva te va observa!</p>
          </div>
        ) : (
          likes.map((l: any) => (
            <Link 
              key={l.id} 
              href={`/profile/${l.swiper.id}`}
              className="bg-slate-900/50 border border-white/5 p-5 rounded-[2rem] flex items-center gap-4 hover:bg-slate-900 transition-all hover:border-red-500/30 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-800 overflow-hidden border-2 border-red-600/20 relative flex-none shadow-xl ring-2 ring-red-600/5">
                {l.swiper.image ? (
                  <img src={l.swiper.image} alt={l.swiper.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-red-600 font-black text-xl">
                    {l.swiper.name[0]}
                  </div>
                )}
                <div className="absolute top-0 right-0 p-1 bg-red-600 rounded-bl-lg shadow-lg">
                   <Heart size={8} fill="white" className="text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-white text-base truncate">{l.swiper.name}, {l.swiper.age}</h3>
                  <Truck size={12} className="text-red-600" />
                </div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest truncate">{l.swiper.truckModel || 'Trucker Elite'}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Ți-a dat Like!</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <ArrowRight size={18} />
              </div>
            </Link>
          ))
        )}
      </div>
      
      <div className="pt-10 text-center opacity-50">
        <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.5em]">
          Premium Experience by Piztolash
        </p>
      </div>
    </div>
  );
}
