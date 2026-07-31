'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { Truck, Users, MessageSquare } from 'lucide-react';
import { getUsersInParking, checkInToParking } from '@/app/actions';

// Fix Leaflet marker icon issue
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

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

  const fetchUsers = async (parking: any) => {
    setSelectedParking(parking);
    const users = await getUsersInParking(parking.id);
    setSelectedParkingUsers(users);
  };

  const handleCheckIn = async (id: number) => {
    await checkInToParking(id);
    alert('Te-ai înregistrat în parcare!');
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={[48.8566, 2.3522]} // Center of Europe roughly
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
                  className="w-full bg-red-600 text-white py-2 rounded-xl text-xs font-black shadow-lg mb-2"
                >
                  SUNT AICI
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Side overlay for users in selected parking */}
      {selectedParking && (
        <div className="absolute top-4 right-4 z-[1000] w-64 bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[70%]">
          <div className="p-4 bg-red-600 flex justify-between items-center">
            <h4 className="text-white font-black text-xs uppercase truncate">{selectedParking.name}</h4>
            <button onClick={() => setSelectedParking(null)} className="text-white/80 text-xs font-bold px-2">X</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {selectedParkingUsers.length > 0 ? (
              selectedParkingUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 font-black text-sm">
                    {u.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-white truncate">{u.name}, {u.age}</p>
                    <p className="text-[9px] text-slate-500 font-bold truncate uppercase italic">{u.truckModel || 'Trucker'}</p>
                  </div>
                  <button className="p-2 bg-red-600 rounded-xl text-white shadow-lg">
                    <MessageSquare size={14} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-[10px] text-slate-500 font-bold py-4">Nu e nimeni aici momentan.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
