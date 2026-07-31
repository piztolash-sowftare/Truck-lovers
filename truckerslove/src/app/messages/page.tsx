import { getMatches } from '@/app/actions';
import { MessageSquare, Heart } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  const matches = await getMatches();

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Perechile Mele</h2>
        <p className="text-sm text-gray-500">Ai găsit pe cineva interesant?</p>
      </div>

      {matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 mb-4">
            <Heart size={40} />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Nicio pereche încă</h3>
          <p className="text-gray-500 max-w-[200px]">Continuă să glisezi pentru a găsi pe cineva!</p>
          <Link href="/" className="mt-6 text-red-600 font-bold underline">Glisează acum</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((m: any) => (
            <div key={m.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-red-200 transition-colors cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xl">
                {m.otherUser?.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-800">{m.otherUser?.name}</h3>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Match!</span>
                </div>
                <p className="text-xs text-gray-500 truncate">Trimite-i un mesaj lui {m.otherUser?.name}...</p>
              </div>
              <div className="text-red-500">
                <MessageSquare size={20} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
