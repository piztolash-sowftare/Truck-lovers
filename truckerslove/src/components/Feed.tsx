'use client';

import React, { useState } from 'react';
import { Camera, Send, MessageCircle, Heart, Trash2, MoreVertical, X, Globe, User } from 'lucide-react';
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
    alert('Postare adăugată!');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8 w-full max-w-lg mx-auto pb-32">
      {/* Create Post */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-6 shadow-2xl"
      >
        <form onSubmit={handlePost} className="space-y-4">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white font-black shadow-lg shadow-red-600/20">
              <User size={24} />
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ce noutăți ai de pe drum, colegule?"
              className="flex-1 bg-transparent border-none text-white focus:ring-0 resize-none font-medium placeholder:text-slate-600 pt-2"
              rows={2}
            />
          </div>
          
          {image && (
            <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video">
               <img src={image} className="w-full h-full object-cover" />
               <button onClick={() => setImage('')} className="absolute top-2 right-2 bg-black/60 p-2 rounded-full text-white hover:bg-red-600 transition-colors">
                 <X size={16} />
               </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <label className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-red-600/10">
                <Camera size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Adaugă Poză</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
            <button type="submit" className="premium-btn py-3 px-8 text-[10px] tracking-[0.2em]">
              POSTEAZĂ
            </button>
          </div>
        </form>
      </motion.div>

      {/* Feed List */}
      <div className="space-y-8">
        {posts.map((post: any) => (
          <motion.div 
            layout
            key={post.id} 
            className="bg-[#020617] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl group hover:border-red-600/20 transition-all duration-500"
          >
            {/* Post Header */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/5 overflow-hidden ring-2 ring-red-600/5">
                  {post.user.image ? <img src={post.user.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-red-500 font-black">{post.user.name[0]}</div>}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-white">{post.user.name}</h3>
                    {post.user.isAdmin && <span className="text-yellow-500 text-[10px] font-black bg-yellow-500/10 px-2 py-0.5 rounded-md">ADMIN</span>}
                  </div>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ro })}
                  </p>
                </div>
              </div>
              {(post.userId === currentUserId || isAdmin) && (
                <button 
                  onClick={async () => {
                    if (confirm('Ștergi postarea?')) {
                      await deleteFeedPost(post.id);
                    }
                  }}
                  className="p-2 text-slate-700 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            {/* Post Content */}
            <div className="px-6 pb-4">
              <p className="text-slate-300 text-sm leading-relaxed font-medium">{post.content}</p>
            </div>

            {post.image && (
              <div className="aspect-square bg-slate-900 border-y border-white/5">
                <img src={post.image} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Post Stats & Actions */}
            <div className="p-6 pt-4 space-y-4">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => likeFeedPost(post.id)}
                  className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${post.likes.some((l: any) => l.userId === currentUserId) ? 'text-red-500 scale-110' : 'text-slate-500 hover:text-white'}`}
                >
                  <Heart size={20} fill={post.likes.some((l: any) => l.userId === currentUserId) ? 'currentColor' : 'none'} />
                  {post.likes.length}
                </button>
                <button 
                  onClick={() => setShowCommentId(showCommentId === post.id ? null : post.id)}
                  className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-white transition-all ${showCommentId === post.id ? 'text-white' : 'text-slate-500'}`}
                >
                  <MessageCircle size={20} />
                  {post.comments.length}
                </button>
              </div>

              {/* Comments Section */}
              <AnimatePresence>
                {showCommentId === post.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-4 overflow-hidden pt-4"
                  >
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {post.comments.map((comment: any) => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-900 border border-white/10 overflow-hidden flex-none mt-1">
                             {comment.user.image ? <img src={comment.user.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-red-500 text-[10px] font-black">{comment.user.name[0]}</div>}
                          </div>
                          <div className="bg-white/5 border border-white/5 p-3 rounded-2xl flex-1">
                            <div className="flex justify-between items-center mb-1">
                               <p className="text-[10px] font-black text-white">{comment.user.name}</p>
                               <span className="text-[8px] text-slate-600 font-bold uppercase">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ro })}</span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium">{comment.content}</p>
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
                      className="flex gap-2"
                    >
                      <input 
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Scrie un comentariu..."
                        className="flex-1 bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-red-600"
                      />
                      <button type="submit" className="bg-red-600 p-2 rounded-xl text-white shadow-lg shadow-red-600/20 active:scale-90 transition-all">
                        <Send size={14} />
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
