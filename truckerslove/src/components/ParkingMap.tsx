'use client';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import React from 'react';

// Define the type for MapContent props
interface MapContentProps {
  parkings: any[];
  currentUserId: any;
}

// Dynamic import with proper typing
const MapContent = dynamic<MapContentProps>(() => import('./MapContent'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900 flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Se încarcă harta...</p>
      </div>
    </div>
  )
});

export default function ParkingMap({ parkings, currentUserId }: { parkings: any[], currentUserId: any }) {
  return (
    <div className="w-full h-full relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl min-h-[400px]">
      <MapContent parkings={parkings} currentUserId={currentUserId} />
    </div>
  );
}
