import { getParkings } from '@/app/actions';
import ParkingMap from '@/components/ParkingMap';
import { MapPin, List } from 'lucide-react';
import Link from 'next/link';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function ParkingPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const session = await getSession();
  const parkings = await getParkings();
  const params = await searchParams;
  const isListView = params.view === 'list';

  return (
    <div className="h-full flex flex-col p-4 overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter">PARCĂRI</h2>
          <p className="text-[10px] text-red-500 font-black uppercase tracking-widest">Harta Completă a Europei</p>
        </div>
        <Link 
          href={isListView ? '/parking' : '/parking?view=list'}
          className="bg-white/5 border border-white/10 p-3 rounded-2xl text-white hover:bg-white/10 transition-all"
        >
          {isListView ? <MapPin size={20} /> : <List size={20} />}
        </Link>
      </div>

      <div className="flex-1 min-h-0 relative">
        {isListView ? (
          <div className="h-full overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {parkings.map((p) => (
              <div key={p.id} className="bg-white/5 border border-white/10 p-5 rounded-3xl flex items-center justify-between group hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-600/20 flex items-center justify-center text-red-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-white">{p.name}</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase">{p.highway} • {p.country}</p>
                  </div>
                </div>
                <button className="bg-red-600 text-white px-4 py-2 rounded-xl text-[10px] font-black shadow-lg">DETALII</button>
              </div>
            ))}
          </div>
        ) : (
          <ParkingMap parkings={parkings} currentUserId={session?.userId} />
        )}
      </div>

      <div className="mt-4 p-4 glass-morphism rounded-3xl">
        <p className="text-[9px] text-slate-500 font-black text-center uppercase tracking-[0.3em]">
          Premium Experience by Piztolash
        </p>
      </div>
    </div>
  );
}
