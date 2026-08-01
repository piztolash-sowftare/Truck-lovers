'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useState } from 'react';
import { Truck, MessageSquare, X, Users, LogOut, MessageCircle } from 'lucide-react';
import { getUsersInParking, checkInToParking } from '@/app/actions';
import ParkingChat from './ParkingChat';
import { motion, AnimatePresence } from 'framer-motion';

const redIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function MapContent({ parkings }: { parkings: any[] }) {
  const [selectedParkingUsers, setSelectedParkingUsers] = useState<any[]>([]);
  const [selectedParking, setSelectedParking] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);

  const fetchUsers = async (parking: any) => {
    setSelectedParking(parking);
    const users = await getUsersInParking(parking.id);
    setSelectedParkingUsers(users);
  };

  const handleCheckIn = async (id: number) => {
    await checkInToParking(id);
    setShowChat(true);
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={[48.8566, 2.3522]} 
        zoom={4} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {parkings.map((p) => (
          <Marker 
            key={p.id} 
            position={[p.latitude, p.longitude]} 
            icon={redIcon}
            eventHandlers={{
              click: () => fetchUsers(p),
            }}
          >
            <Popup className="premium-popup">
              <div className="p-2 min-w-[200px]">
                <h3 className="font-black text-slate-900 text-lg leading-tight">{p.name}</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-3">{p.highway} • {p.country}</p>
                
                <button 
                  onClick={() => handleCheckIn(p.id)}
                  className="w-full bg-red-600 text-white py-2 rounded-xl text-xs font-black shadow-lg mb-2 flex items-center justify-center gap-2"
                >
                  <Truck size={14} /> SUNT AICI
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Side overlay for users in selected parking */}
      <AnimatePresence>
        {selectedParking && !showChat && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute top-4 right-4 bottom-4 z-[1000] w-72 bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-5 bg-gradient-to-r from-red-600 to-red-800 flex justify-between items-center shadow-lg">
              <div className="min-w-0">
                <h4 className="text-white font-black text-xs uppercase truncate">{selectedParking.name}</h4>
                <p className="text-[8px] text-white/60 font-black uppercase tracking-widest">{selectedParkingUsers.length} colegi aici</p>
              </div>
              <button onClick={() => setSelectedParking(null)} className="text-white/80 hover:text-white transition-colors p-1">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {selectedParkingUsers.length > 0 ? (
                selectedParkingUsers.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 hover:border-red-500/30 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 overflow-hidden relative shadow-lg">
                       {u.image ? <img src={u.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-red-500 font-black">{u.name[0]}</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-white truncate">{u.name}, {u.age}</p>
                      <p className="text-[9px] text-slate-500 font-bold truncate uppercase italic">{u.truckModel || 'Trucker'}</p>
                    </div>
                    <Link href={`/messages/new/${u.id}`} className="p-2 bg-red-600 rounded-lg text-white shadow-lg active:scale-90 transition-all">
                      <MessageSquare size={14} />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 opacity-30">
                  <Users size={32} className="mx-auto mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Niciun coleg logat aici</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-950/50 border-t border-white/5">
               <button 
                onClick={() => setShowChat(true)}
                className="w-full bg-slate-900 border border-white/10 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl"
               >
                 <MessageCircle size={14} className="text-red-500" /> Deschide Stația Locală
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Parking Chat Modal Overlay */}
      <AnimatePresence>
        {showChat && selectedParking && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-x-4 bottom-4 top-20 z-[2000] shadow-2xl"
          >
            <ParkingChat 
              parking={selectedParking} 
              onClose={() => setShowChat(false)} 
              currentUserId={1 /* Mock for now, use context in production */} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import Link from 'next/link';
