'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Search, Truck, MessageSquare, X, Users, Heart } from 'lucide-react';
import { checkInToParking, getParkings, getUsersInParking } from '@/app/actions';
import { motion, AnimatePresence } from 'framer-motion';

interface Parking {
  id: number;
  name: string;
  highway: string | null;
  country: string | null;
}

interface User {
  id: number;
  name: string;
  truckModel: string | null;
  image: string | null;
  bio: string | null;
}

export default function ParkingContainer({ initialParkings, currentParkingId }: { initialParkings: Parking[], currentParkingId?: number | null }) {
  const [parkings, setParkings] = useState(initialParkings);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedParking, setSelectedParking] = useState<Parking | null>(null);
  const [usersInParking, setUsersInParking] = useState<User[]>([]);
  const [checkingIn, setCheckingIn] = useState<number | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      const results = await getParkings(searchTerm);
      setParkings(results);
      setLoading(false);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleCheckIn = async (p: Parking) => {
    setCheckingIn(p.id);
    await checkInToParking(p.id);
    setCheckingIn(null);
    handleViewParking(p);
  };

  const handleViewParking = async (p: Parking) => {
    setSelectedParking(p);
    const users = await getUsersInParking(p.id);
    setUsersInParking(users);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Caută parcare, autostradă sau țară..."
          className="w-full bg-gray-100 border-none rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Parking List */}
      <div className="space-y-3">
        {parkings.map((p) => (
          <div 
            key={p.id} 
            className={`bg-white p-4 rounded-2xl border transition-all shadow-sm ${currentParkingId === p.id ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30' : 'border-gray-100'}`}
          >
            <div className="flex items-center justify-between">
              <div 
                className="flex items-center gap-4 flex-1 cursor-pointer"
                onClick={() => handleViewParking(p)}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${currentParkingId === p.id ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    {p.name}
                    {currentParkingId === p.id && <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full uppercase">Sunt aici</span>}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">{p.highway} • {p.country}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewParking(p)}
                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Vezi cine e aici"
                >
                  <Users size={20} />
                </button>
                {currentParkingId !== p.id && (
                  <button
                    onClick={() => handleCheckIn(p)}
                    disabled={checkingIn === p.id}
                    className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-red-700 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {checkingIn === p.id ? '...' : 'SUNT AICI'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {parkings.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Search size={32} />
            </div>
            <p className="text-gray-500 font-bold">Nicio parcare găsită pentru "{searchTerm}"</p>
            <p className="text-xs text-gray-400 mt-1">Încearcă să cauți după numele autostrăzii (ex: A1, M6)</p>
          </div>
        )}
      </div>

      {/* Users In Parking Modal */}
      <AnimatePresence>
        {selectedParking && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center sm:items-center p-4"
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                  <h3 className="text-lg font-black text-gray-900 leading-tight">{selectedParking.name}</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase">{usersInParking.length} colegi prezenți acum</p>
                </div>
                <button 
                  onClick={() => setSelectedParking(null)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {usersInParking.length > 0 ? (
                  usersInParking.map((u) => (
                    <div key={u.id} className="bg-gray-50 p-4 rounded-2xl flex items-center gap-4 border border-gray-100 hover:border-red-200 transition-colors">
                      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-black text-xl border-2 border-white shadow-sm">
                        {u.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 truncate">{u.name}</h4>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase mb-1">
                          <Truck size={10} className="text-red-500" />
                          {u.truckModel || 'Model nespecificat'}
                        </div>
                        <p className="text-xs text-gray-400 truncate italic">"{u.bio || 'Drumuri bune!'}"</p>
                      </div>
                      <div className="flex flex-col gap-2">
                         <button 
                          className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-md active:scale-95"
                          onClick={() => alert(`Mesaj privat către ${u.name} (Funcție în dezvoltare)`)}
                        >
                          <MessageSquare size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Truck size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-400 font-bold">E liniște în parcare...</p>
                    <p className="text-xs text-gray-400">Fii primul care face check-in aici!</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <button 
                  className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2"
                  onClick={() => setSelectedParking(null)}
                >
                  ÎNCHIDE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
