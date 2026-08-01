'use strict';
'use server';

import { db } from '@/db';
import { users, swipes, globalMessages, parkings, matches, privateMessages, profileVisits, parkingMessages, blocks, feedPosts, feedComments, feedLikes, notifications } from '@/db/schema';
import { eq, and, or, sql, inArray, not, desc, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

async function getCurrentUserId() {
  const session = await getSession();
  const userId = session?.userId;
  if (userId) {
    db.update(users).set({ lastActiveAt: new Date() }).where(eq(users.id, userId)).execute();
  }
  return userId;
}

export async function isOnline(lastActive: Date | null) {
  if (!lastActive) return false;
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return lastActive > fiveMinutesAgo;
}

export async function getUsersToSwipe(filters: { 
  mode?: 'all' | 'route' | 'nearby', 
  gender?: string, 
  minAge?: number, 
  maxAge?: number 
} = {}) {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  let currentUser;
  try {
    currentUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
  } catch (e) {
    console.error('Error fetching current user:', e);
    return [];
  }

  if (!currentUser) return [];

  const swipedRes = await db.select({ id: swipes.swipedId })
    .from(swipes)
    .where(eq(swipes.swiperId, userId));

  const blockedByMe = await db.select({ id: blocks.blockedId }).from(blocks).where(eq(blocks.blockerId, userId));
  const blockers = await db.select({ id: blocks.blockerId }).from(blocks).where(eq(blocks.blockedId, userId));

  const excludedIds = [
    userId, 
    ...swipedRes.map(s => s.id),
    ...blockedByMe.map(b => b.id),
    ...blockers.map(b => b.id)
  ];

  let conditions: any[] = [not(inArray(users.id, excludedIds))];

  if (!filters.gender && currentUser.lookingFor && currentUser.lookingFor !== 'both') {
    conditions.push(eq(users.gender, currentUser.lookingFor));
  } else if (filters.gender && filters.gender !== 'both') {
    conditions.push(eq(users.gender, filters.gender));
  }

  if (filters.minAge) conditions.push(sql`${users.age} >= ${filters.minAge}`);
  if (filters.maxAge) conditions.push(sql`${users.age} <= ${filters.maxAge}`);

  if (filters.mode === 'route' && currentUser.routeStart && currentUser.routeEnd) {
    conditions.push(or(
      eq(users.routeStart, currentUser.routeStart),
      eq(users.routeEnd, currentUser.routeEnd)
    ) as any);
  } else if (filters.mode === 'nearby' && currentUser.currentParkingId) {
    conditions.push(eq(users.currentParkingId, currentUser.currentParkingId));
  }

  const potentialMatches = await db.query.users.findMany({
    where: and(...conditions),
    limit: 20,
  });

  return potentialMatches;
}

export async function updateFullProfile(data: { 
  routeStart?: string, 
  routeEnd?: string, 
  bio?: string, 
  truckModel?: string, 
  experience?: string, 
  hobbies?: string,
  gender?: string,
  lookingFor?: string,
  age?: number,
  images?: string[]
}) {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const { images, ...otherData } = data;
  
  const updatePayload: any = { ...otherData };
  if (images && images.length > 0) {
    updatePayload.image = images[0];
    updatePayload.images = JSON.stringify(images);
  }

  await db.update(users)
    .set(updatePayload)
    .where(eq(users.id, userId));
    
  revalidatePath('/profile');
}

export async function uploadProfileImages(images: string[]) {
    return await updateFullProfile({ images });
}

export async function logProfileVisit(visitedId: number) {
  const userId = await getCurrentUserId();
  if (!userId || userId === visitedId) return;

  await db.insert(profileVisits).values({
    visitorId: userId,
    visitedId: visitedId,
  });
}

export async function getProfileVisitors() {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const visits = await db.query.profileVisits.findMany({
    where: eq(profileVisits.visitedId, userId),
    with: {
      visitor: true,
    },
    orderBy: (visit: any, { desc }: any) => [desc(visit.createdAt)],
    limit: 20,
  });

  return visits;
}

export async function forgotPasswordAction(email: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    return { error: 'Acest email nu este înregistrat!' };
  }

  return { success: 'Un email pentru resetarea parolei a fost trimis (simulat).' };
}

export async function swipeUser(targetId: number, type: 'like' | 'dislike') {
  const userId = await getCurrentUserId();
  if (!userId) return { match: false };

  await logProfileVisit(targetId);

  await db.insert(swipes).values({
    swiperId: userId,
    swipedId: targetId,
    type,
  });

  if (type === 'like') {
    const reciprocalSwipe = await db.query.swipes.findFirst({
      where: and(
        eq(swipes.swiperId, targetId),
        eq(swipes.swipedId, userId),
        eq(swipes.type, 'like')
      ),
    });

    if (reciprocalSwipe) {
      await db.insert(matches).values({
        user1Id: Math.min(userId, targetId),
        user2Id: Math.max(userId, targetId),
      });

      await db.insert(notifications).values({
        userId: targetId,
        actorId: userId,
        type: 'match'
      });

      return { match: true };
    } else {
        await db.insert(notifications).values({
            userId: targetId,
            actorId: userId,
            type: 'like'
        });
    }
  }

  revalidatePath('/');
  return { match: false };
}

export async function sendGlobalMessage(content: string) {
  const userId = await getCurrentUserId();
  if (!userId) return;

  await db.insert(globalMessages).values({
    userId,
    content,
  });
  revalidatePath('/chat');
}

export async function getGlobalMessages() {
  const userId = await getCurrentUserId();
  const blockedByMe = userId ? await db.select({ id: blocks.blockedId }).from(blocks).where(eq(blocks.blockerId, userId)) : [];
  const blockers = userId ? await db.select({ id: blocks.blockerId }).from(blocks).where(eq(blocks.blockedId, userId)) : [];
  const excludedIds = [...blockedByMe.map(b => b.id), ...blockers.map(b => b.id)];

  return await db.query.globalMessages.findMany({
    where: excludedIds.length > 0 ? not(inArray(globalMessages.userId, excludedIds)) : undefined,
    with: {
      user: true,
    },
    orderBy: (msg: any, { desc }: any) => [desc(msg.createdAt)],
    limit: 50,
  });
}

export async function sendParkingMessage(parkingId: number, content: string) {
  const userId = await getCurrentUserId();
  if (!userId) return;

  await db.insert(parkingMessages).values({
    parkingId,
    userId,
    content,
  });
  revalidatePath('/parking');
}

export async function getParkingMessages(parkingId: number) {
  return await db.query.parkingMessages.findMany({
    where: eq(parkingMessages.parkingId, parkingId),
    with: {
      user: true,
    },
    orderBy: (msg: any, { asc }: any) => [asc(msg.createdAt)],
    limit: 100,
  });
}

export async function getParkings(search?: string) {
  if (search) {
    return await db.query.parkings.findMany({
      where: or(
        sql`${parkings.name} ILIKE ${'%' + search + '%'}`,
        sql`${parkings.highway} ILIKE ${'%' + search + '%'}`,
        sql`${parkings.country} ILIKE ${'%' + search + '%'}`
      )
    });
  }
  return await db.query.parkings.findMany();
}

export async function getUsersInParking(parkingId: number) {
  return await db.query.users.findMany({
    where: eq(users.currentParkingId, parkingId),
  });
}

export async function checkInToParking(parkingId: number) {
  const userId = await getCurrentUserId();
  if (!userId) return;

  await db.update(users)
    .set({ currentParkingId: parkingId === 0 ? null : parkingId })
    .where(eq(users.id, userId));
  revalidatePath('/parking');
}

export async function getMatches() {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const blockedByMe = await db.select({ id: blocks.blockedId }).from(blocks).where(eq(blocks.blockerId, userId));
  const blockers = await db.select({ id: blocks.blockerId }).from(blocks).where(eq(blocks.blockedId, userId));
  const excludedIds = [...blockedByMe.map(b => b.id), ...blockers.map(b => b.id)];

  const userMatches = await db.query.matches.findMany({
    where: (m: any, { and, or, not, inArray }: any) => {
      let cond = or(eq(m.user1Id, userId), eq(m.user2Id, userId));
      if (excludedIds.length > 0) {
        cond = and(cond, not(or(inArray(m.user1Id, excludedIds), inArray(m.user2Id, excludedIds))));
      }
      return cond;
    },
  });

  const matchDetails = await Promise.all(userMatches.map(async (m: any) => {
    const otherUserId = m.user1Id === userId ? m.user2Id : m.user1Id;
    const otherUser = await db.query.users.findFirst({
      where: eq(users.id, otherUserId),
    });
    
    const lastMsg = await db.query.privateMessages.findFirst({
      where: eq(privateMessages.matchId, m.id),
      orderBy: (msg: any, { desc }: any) => [desc(msg.createdAt)],
    });

    return { ...m, otherUser, lastMsg };
  }));

  return matchDetails;
}

export async function getPrivateMessages(matchId: number) {
  return await db.query.privateMessages.findMany({
    where: eq(privateMessages.matchId, matchId),
    orderBy: (msg: any, { asc }: any) => [asc(msg.createdAt)],
  });
}

export async function sendPrivateMessage(matchId: number, content: string) {
  const userId = await getCurrentUserId();
  if (!userId) return;

  await db.insert(privateMessages).values({
    matchId,
    senderId: userId,
    content,
  });
  
  revalidatePath(`/messages/${matchId}`);
}

export async function unmatchUser(matchId: number) {
  await db.delete(matches).where(eq(matches.id, matchId));
  revalidatePath('/messages');
}

export async function blockUser(targetId: number) {
  const userId = await getCurrentUserId();
  if (!userId) return;

  await db.insert(blocks).values({
    blockerId: userId,
    blockedId: targetId,
  });

  await db.delete(matches).where(
    or(
      and(eq(matches.user1Id, userId), eq(matches.user2Id, targetId)),
      and(eq(matches.user2Id, userId), eq(matches.user1Id, targetId))
    )
  );

  revalidatePath('/messages');
  revalidatePath('/');
}

export async function getUserProfile(id: number) {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  await logProfileVisit(id);

  return await db.query.users.findFirst({
    where: eq(users.id, id),
  });
}

export async function createFeedPost(content: string, image?: string) {
  const userId = await getCurrentUserId();
  if (!userId) return;

  await db.insert(feedPosts).values({
    userId,
    content,
    image,
  });
  revalidatePath('/feed');
}

export async function getFeedPosts() {
  return await db.query.feedPosts.findMany({
    with: {
      user: true,
      comments: { with: { user: true } },
      likes: true,
    },
    orderBy: [desc(feedPosts.createdAt)],
  });
}

export async function deleteFeedPost(postId: number) {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const post = await db.query.feedPosts.findFirst({ where: eq(feedPosts.id, postId) });
  const currentUser = await db.query.users.findFirst({ where: eq(users.id, userId) });

  if (post?.userId === userId || currentUser?.isAdmin) {
    await db.delete(feedComments).where(eq(feedComments.postId, postId));
    await db.delete(feedLikes).where(eq(feedLikes.postId, postId));
    await db.delete(feedPosts).where(eq(feedPosts.id, postId));
  }
  revalidatePath('/feed');
}

export async function likeFeedPost(postId: number) {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const existing = await db.query.feedLikes.findFirst({
    where: and(eq(feedLikes.postId, postId), eq(feedLikes.userId, userId)),
  });

  if (existing) {
    await db.delete(feedLikes).where(eq(feedLikes.id, existing.id));
  } else {
    await db.insert(feedLikes).values({ postId, userId });
    
    const post = await db.query.feedPosts.findFirst({ where: eq(feedPosts.id, postId) });
    if (post && post.userId !== userId) {
      await db.insert(notifications).values({
        userId: post.userId,
        actorId: userId,
        type: 'feed_like',
        postId,
      });
    }
  }
  revalidatePath('/feed');
}

export async function addFeedComment(postId: number, content: string) {
  const userId = await getCurrentUserId();
  if (!userId) return;

  await db.insert(feedComments).values({ postId, userId, content });
  
  const post = await db.query.feedPosts.findFirst({ where: eq(feedPosts.id, postId) });
  if (post && post.userId !== userId) {
    await db.insert(notifications).values({
      userId: post.userId,
      actorId: userId,
      type: 'comment',
      postId,
    });
  }
  revalidatePath('/feed');
}

export async function getNotifications() {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  return await db.query.notifications.findMany({
    where: eq(notifications.userId, userId),
    with: { actor: true },
    orderBy: [desc(notifications.createdAt)],
  });
}

export async function markNotificationsRead() {
  const userId = await getCurrentUserId();
  if (!userId) return;
  await db.update(notifications).set({ read: true }).where(eq(notifications.userId, userId));
  revalidatePath('/');
}

export async function getAllUsers() {
  const userId = await getCurrentUserId();
  if (!userId) return [];
  
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user?.isAdmin) throw new Error('Unauthorized');

  return await db.query.users.findMany({
    orderBy: (u: any, { desc }: any) => [desc(u.createdAt)],
  });
}

export async function deleteUser(id: number) {
  const userId = await getCurrentUserId();
  if (!userId) return;
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user?.isAdmin) throw new Error('Unauthorized');

  await db.delete(users).where(eq(users.id, id));
  revalidatePath('/admin');
}

export async function adminDeletePhoto(targetUserId: number, photoIndex: number) {
  const userId = await getCurrentUserId();
  if (!userId) return;
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user?.isAdmin) throw new Error('Unauthorized');

  const targetUser = await db.query.users.findFirst({ where: eq(users.id, targetUserId) });
  if (!targetUser?.images) return;

  const images = JSON.parse(targetUser.images);
  const newImages = images.filter((_: any, i: number) => i !== photoIndex);
  
  await db.update(users)
    .set({ 
      image: newImages[0] || null,
      images: JSON.stringify(newImages) 
    })
    .where(eq(users.id, targetUserId));
    
  revalidatePath(`/profile/${targetUserId}`);
}

export async function adminDeleteGlobalMessage(messageId: number) {
  const userId = await getCurrentUserId();
  if (!userId) return;
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user?.isAdmin) return;

  await db.delete(globalMessages).where(eq(globalMessages.id, messageId));
  revalidatePath('/chat');
}

export async function adminDeleteParkingMessage(messageId: number) {
  const userId = await getCurrentUserId();
  if (!userId) return;
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user?.isAdmin) return;

  await db.delete(parkingMessages).where(eq(parkingMessages.id, messageId));
  revalidatePath('/parking');
}

export async function adminClearAllMessages() {
  const userId = await getCurrentUserId();
  if (!userId) return;
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user?.isAdmin) return;

  await db.delete(globalMessages);
  await db.delete(parkingMessages);
  revalidatePath('/chat');
  revalidatePath('/parking');
}

export async function getReceivedLikes() {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const receivedLikes = await db.query.swipes.findMany({
    where: and(eq(swipes.swipedId, userId), eq(swipes.type, 'like')),
    with: {
      swiper: true,
    },
    orderBy: (s: any, { desc }: any) => [desc(s.createdAt)],
  });

  return receivedLikes;
}
