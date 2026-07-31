import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import ProfileForm from '@/components/ProfileForm';

export const dynamic = 'force-dynamic';

import { Camera, Truck } from 'lucide-react';

export default async function ProfilePage() {
  const user = await db.query.users.findFirst({
    where: eq(users.id, 1),
  });

  if (!user) return <div>Utilizator negăsit.</div>;

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col items-center">
        <div className="relative group">
          <div className="w-32 h-32 rounded-[2rem] bg-slate-900 overflow-hidden border-4 border-slate-800 shadow-2xl flex items-center justify-center">
            {user.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-5xl font-black text-red-600">
                {user.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-red-600 text-white p-3 rounded-2xl shadow-lg border-4 border-slate-950">
            <Camera size={20} />
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-black text-gray-900">{user.name}, {user.age || 28}</h2>
          <div className="flex items-center justify-center gap-2 mt-1">
             <span className="text-[10px] font-black uppercase text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
              {user.role === 'driver' ? 'Șofer Profesionist' : 'Admirator'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-800">
          Setări Rută & Profil
        </h3>
        <ProfileForm user={user} />
      </div>

      <div className="bg-gradient-to-br from-red-600 to-red-800 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute -right-6 -top-6 opacity-10 rotate-12">
          <Truck size={120} />
        </div>
        <h3 className="font-black text-2xl mb-3 tracking-tighter uppercase italic">TRUCKLOVERS ELITE</h3>
        <p className="text-xs opacity-90 leading-relaxed font-bold tracking-tight">
          TruckLovers este mai mult decât o aplicație. Este frăția celor care stăpânesc asfaltul Europei. Găsește-ți partenerul de cursă lungă chiar aici.
          <br /><br />
          Fiecare kilometru contează, fiecare întâlnire este o destinație.
        </p>
      </div>

      <div className="py-8 text-center border-t border-white/5">
        <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.5em]">
          Premium Experience by Piztolash
        </p>
      </div>
    </div>
  );
}
