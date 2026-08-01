'use client';

import React, { useState } from 'react';
import { Camera, Send, MessageCircle, Heart, Trash2, X, User, ShieldCheck } from 'lucide-react';
import { createFeedPost, likeFeedPost, addFeedComment, deleteFeedPost } from '@/app/actions';
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

export default function Feed({ initialPosts, currentUserId, isAdmin }: any) {
  const [posts, setPosts] = useState(initialPosts);
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [showCommentId, setShowCommentId] = useState<number | null>(null);
  const [commentContent, setCommentContent] = useState('');

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image) return;
    
    await createFeedPost(content, image);
    setContent('');
    setImage('');
    alert('Postare adăugată pe stația Feed!');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-10 w-full max-w-lg mx-auto pb-32">
      {/* Premium Create Post */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="ultra-glass rounded-[3rem] p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
           <ShieldCheck size={120} />
        </div>
        <form onSubmit={handlePost} className="space-y-6 relative z-10">
          <div className="flex gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-xl flex-none">
              <User size={28} />
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ce noutăți ai din cabină?"
              className="flex-1 bg-transparent border-none text-white focus:ring-0 resize-none font-bold placeholder:text-slate-700 text-lg py-2"
              rows={2}
            />
          </div>
          
          {image && (
            <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 aspect-video shadow-2xl group">
               <img src={image} className="w-full h-full object-cover" />
               <button onClick={() => setImage('')} className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-2xl text-white hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100">
                 <X size={20} />
               </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t border-white/[0.03]">
            <label className="flex items-center gap-3 text-slate-500 hover:text-white transition-all cursor-pointer group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-red-600/20 group-active:scale-90 transition-all">
                <Camera size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Capturează Momentul</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
            <button type="submit" className="btn-primary py-4 px-10 rounded-[1.5rem] shadow-red-600/30">
              LANSEAZĂ
            </button>
          </div>
        </form>
      </motion.div>

      {/* Feed List - Tinder/Instagram Fusion */}
      <div className="space-y-12">
        {posts.map((post: any) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            key={post.id} 
            className="bg-[#050505] border border-white/[0.05] rounded-[3rem] overflow-hidden shadow-2xl group transition-all"
          >
            {/* Header */}
            <div className="p-7 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/5 overflow-hidden ring-2 ring-red-600/5 shadow-lg">
                  {post.user.image ? <img src={post.user.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-red-600 font-black text-xl">{post.user.name[0]}</div>}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-white text-lg tracking-tight italic">{post.user.name}</h3>
                    {post.user.isAdmin && <div className="bg-yellow-500 text-black text-[7px] font-black px-1.5 py-0.5 rounded-md animate-pulse">ADMIN A</div>}
                  </div>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ro })}
                  </p>
                </div>
              </div>
              {(post.userId === currentUserId || isAdmin) && (
                <button 
                  onClick={async () => {
                    if (confirm('Elimini această înregistrare din istoric?')) {
                      await deleteFeedPost(post.id);
                    }
                  }}
                  className="p-3 text-slate-800 hover:text-red-500 transition-colors bg-white/5 rounded-2xl active:scale-90"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            {/* Content area */}
            <div className="px-8 pb-6">
              <p className="text-slate-300 text-base leading-relaxed font-medium">{post.content}</p>
            </div>

            {post.image && (
              <div className="aspect-[4/5] bg-slate-900 overflow-hidden relative border-y border-white/[0.03]">
                <img src={post.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            )}

            {/* Interactions */}
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-8">
                <button 
                  onClick={() => likeFeedPost(post.id)}
                  className={`flex items-center gap-2.5 text-xs font-black uppercase tracking-widest transition-all ${post.likes.some((l: any) => l.userId === currentUserId) ? 'text-red-500 scale-110' : 'text-slate-600 hover:text-white'}`}
                >
                  <Heart size={26} fill={post.likes.some((l: any) => l.userId === currentUserId) ? 'currentColor' : 'none'} strokeWidth={2.5} />
                  <span className="mt-1">{post.likes.length}</span>
                </button>
                <button 
                  onClick={() => setShowCommentId(showCommentId === post.id ? null : post.id)}
                  className={`flex items-center gap-2.5 text-xs font-black uppercase tracking-widest transition-all ${showCommentId === post.id ? 'text-white' : 'text-slate-600'}`}
                >
                  <MessageCircle size={26} strokeWidth={2.5} />
                  <span className="mt-1">{post.comments.length}</span>
                </button>
              </div>

              {/* Enhanced Comments */}
              <AnimatePresence>
                {showCommentId === post.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-6 overflow-hidden pt-4 border-t border-white/[0.03]"
                  >
                    <div className="space-y-5 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                      {post.comments.map((comment: any) => (
                        <div key={comment.id} className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 overflow-hidden flex-none">
                             {comment.user.image ? <img src={comment.user.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-red-500 text-xs font-black">{comment.user.name[0]}</div>}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1.5">
                               <p className="text-xs font-black text-white tracking-tight uppercase">{comment.user.name}</p>
                               <span className="text-[8px] text-slate-700 font-bold uppercase tracking-widest">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ro })}</span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <form 
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!commentContent.trim()) return;
                        await addFeedComment(post.id, commentContent);
                        setCommentContent('');
                      }}
                      className="flex gap-3 bg-white/[0.03] p-3 rounded-2xl border border-white/[0.05]"
                    >
                      <input 
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Lipsește un comentariu..."
                        className="flex-1 bg-transparent border-none text-xs text-white outline-none focus:ring-0 font-medium"
                      />
                      <button type="submit" className="bg-red-600 p-3 rounded-xl text-white shadow-xl shadow-red-600/20 active:scale-90 transition-all">
                        <Send size={16} />
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
