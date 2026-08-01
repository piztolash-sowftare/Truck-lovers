import { getUsersToSwipe } from './actions';
import SwipeCards from '@/components/SwipeCards';
import Link from 'next/link';
import { Filter, MapPin, Truck, Globe } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: Promise<{ mode?: string, gender?: string }> }) {
  const params = await searchParams;
  const mode = (params.mode as any) || 'all';
  const gender = params.gender || 'both';
  
  let users: any[] = [];
  try {
    users = await getUsersToSwipe({ 
      mode, 
      gender: gender === 'both' ? undefined : gender 
    });
  } catch (e) {
    console.error('Home page users fetch failed:', e);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-sm">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-gray-900">DECOPERĂ</h2>
            <Link href="/profile" className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">Filtrează</Link>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <Link 
              href="/?mode=all" 
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${mode === 'all' ? 'bg-red-600 text-white' : 'bg-white text-gray-600 border border-gray-100'}`}
            >
              <Globe size={14} /> Global
            </Link>
            <Link 
              href="/?mode=route" 
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${mode === 'route' ? 'bg-red-600 text-white' : 'bg-white text-gray-600 border border-gray-100'}`}
            >
              <Truck size={14} /> Pe Ruta Mea
            </Link>
            <Link 
              href="/?mode=nearby" 
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${mode === 'nearby' ? 'bg-red-600 text-white' : 'bg-white text-gray-600 border border-gray-100'}`}
            >
              <MapPin size={14} /> În Parcare
            </Link>
          </div>
        </div>

        <SwipeCards initialUsers={users as any} />
      </div>
    </div>
  );
}
