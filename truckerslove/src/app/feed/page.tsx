import { getFeedPosts } from '@/app/actions';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Feed from '@/components/Feed';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function FeedPage() {
  const session = await getSession();
  if (!session) redirect('/');

  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
  });

  const posts = await getFeedPosts();

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-2 px-2 pt-2">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter">FEED GLOBAL</h2>
          <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.3em]">Comunitatea în Direct</p>
        </div>
      </div>
      
      <Feed 
        initialPosts={posts} 
        currentUserId={session.userId} 
        isAdmin={currentUser?.isAdmin} 
      />
    </div>
  );
}
