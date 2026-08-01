import { getGlobalMessages } from '@/app/actions';
import ChatRoom from '@/components/ChatRoom';
import { Globe, Truck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ChatPage() {
  const messages = await getGlobalMessages();

  return (
    <div className="h-full flex flex-col p-4">
      <div className="mb-6 bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-[2rem] flex items-center justify-between border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12">
           <Truck size={80} />
        </div>
        <div className="z-10">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">STAȚIA</h2>
          <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.3em]">Canal 22 • LIVE</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-red-600/20 flex items-center justify-center border border-red-500/20 z-10">
          <Globe className="text-red-500 animate-pulse" size={24} />
        </div>
      </div>
      <ChatRoom initialMessages={messages} />
      
      <div className="mt-6 p-4">
         <p className="text-[9px] text-slate-600 font-black text-center uppercase tracking-[0.4em]">
          Premium Experience by Piztolash
        </p>
      </div>
    </div>
  );
}
