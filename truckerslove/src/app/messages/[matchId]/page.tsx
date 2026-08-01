import { db } from '@/db';
import { matches, users } from '@/db/schema';
import { eq, or, and } from 'drizzle-orm';
import { getPrivateMessages } from '@/app/actions';
import { getSession } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import ChatView from '@/components/ChatView';

export const dynamic = 'force-dynamic';

export default async function MatchChatPage({ params }: { params: Promise<{ matchId: string }> }) {
  const session = await getSession();
  if (!session) redirect('/');

  const { matchId } = await params;
  const mId = parseInt(matchId);

  // Verify access to this match
  const match = await db.query.matches.findFirst({
    where: and(
      eq(matches.id, mId),
      or(eq(matches.user1Id, session.userId), eq(matches.user2Id, session.userId))
    ),
  });

  if (!match) notFound();

  const otherUserId = match.user1Id === session.userId ? match.user2Id : match.user1Id;
  const otherUser = await db.query.users.findFirst({
    where: eq(users.id, otherUserId),
  });

  const messages = await getPrivateMessages(mId);

  return (
    <ChatView 
      matchId={mId} 
      otherUser={otherUser} 
      initialMessages={messages} 
      currentUserId={session.userId} 
    />
  );
}
