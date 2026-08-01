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
    <div className="flex gap-4 w-full px-2">
      {isMatch ? (
        <button 
          onClick={() => router.push('/messages')}
          className="flex-1 btn-elite !bg-emerald-600 shadow-emerald-900/20 py-4"
        >
          <MessageCircle size={18} />
          TRIMITE MESAJ
        </button>
      ) : (
        <>
          <button 
            disabled={loading}
            onClick={handleLike}
            className="flex-1 btn-elite py-4"
          >
            <Heart size={18} fill="currentColor" />
            DĂ-I LIKE
          </button>
          <button 
            onClick={() => alert('Trebuie să aveți match pentru a trimite mesaje private!')}
            className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all active:scale-90"
          >
            <MessageCircle size={22} />
          </button>
        </>
      )}
    </div>
  );
}
