'use client';

import React, { useState } from 'react';
import { Heart, MessageCircle, Truck } from 'lucide-react';
import { swipeUser } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function ProfileActions({ targetId, isMatch }: { targetId: number, isMatch: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLike = async () => {
    setLoading(true);
    const result = await swipeUser(targetId, 'like');
    setLoading(false);
    if (result.match) {
      alert('BRAVO BOSS! E MATCH! Acum îi poți scrie.');
      router.push('/messages');
    } else {
      alert('I-ai dat LIKE colegului/colegei!');
    }
  };

  return (
    <div className="flex gap-4 w-full">
      {isMatch ? (
        <button 
          onClick={() => router.push('/messages')}
          className="flex-1 premium-btn py-5 bg-gradient-to-r from-emerald-600 to-emerald-800 shadow-emerald-900/20"
        >
          <MessageCircle size={20} />
          TRIMITE MESAJ
        </button>
      ) : (
        <>
          <button 
            disabled={loading}
            onClick={handleLike}
            className="flex-1 premium-btn py-5"
          >
            <Heart size={20} fill="currentColor" />
            DĂ-I LIKE
          </button>
          <button 
            onClick={() => alert('Trebuie să aveți match pentru a trimite mesaje private!')}
            className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all"
          >
            <MessageCircle size={24} />
          </button>
        </>
      )}
    </div>
  );
}
