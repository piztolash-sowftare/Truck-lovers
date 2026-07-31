'use strict';
'use server';

import { db } from '@/db';
import { users, swipes, globalMessages, parkings, matches, privateMessages, profileVisits } from '@/db/schema';
import { eq, ne, and, or, sql, inArray, not } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

async function getCurrentUserId() {
  const session = await getSession();
  return session?.userId;
}

export async function getUsersToSwipe(filters: { 
  mode?: 'all' | 'route' | 'nearby', 
  gender?: string, 
  minAge?: number, 
  maxAge?: number 
} = {}) {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!currentUser) return [];

  const swipedRes = await db.select({ id: swipes.swipedId })
    .from(swipes)
    .where(eq(swipes.swiperId, userId));

  const excludedIds = [userId, ...swipedRes.map(s => s.id)];

  let conditions = [not(inArray(users.id, excludedIds))];

  if (filters.gender && filters.gender !== 'both') {
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

export async function uploadProfileImages(images: string[]) {
  const userId = await getCurrentUserId();
  if (!userId) return;

  await db.update(users)
    .set({ 
      image: images[0], 
      images: JSON.stringify(images) 
    })
    .where(eq(users.id, userId));
  revalidatePath('/profile');
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
    orderBy: (visit, { desc }) => [desc(visit.createdAt)],
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

  // In a real app, send a reset token via email
  console.log(`Password reset requested for ${email}`);
  return { success: 'Un email pentru resetarea parolei a fost trimis (simulat).' };
}

export async function swipeUser(targetId: number, type: 'like' | 'dislike') {
  const userId = await getCurrentUserId();
  if (!userId) return { match: false };

  // Log a visit when swiping
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
      return { match: true };
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
  return await db.query.globalMessages.findMany({
    with: {
      user: true,
    },
    orderBy: (msg: any, { desc }: any) => [desc(msg.createdAt)],
    limit: 50,
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
    .set({ currentParkingId: parkingId })
    .where(eq(users.id, userId));
  revalidatePath('/parking');
}

export async function updateProfile(data: { 
  routeStart?: string, 
  routeEnd?: string, 
  bio?: string, 
  truckModel?: string, 
  experience?: string, 
  hobbies?: string,
  gender?: string,
  lookingFor?: string,
  age?: number
}) {
  const userId = await getCurrentUserId();
  if (!userId) return;

  await db.update(users)
    .set(data)
    .where(eq(users.id, userId));
  revalidatePath('/profile');
}

export async function getMatches() {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const userMatches = await db.query.matches.findMany({
    where: or(
      eq(matches.user1Id, userId),
      eq(matches.user2Id, userId)
    ),
  });

  const matchDetails = await Promise.all(userMatches.map(async (m: any) => {
    const otherUserId = m.user1Id === userId ? m.user2Id : m.user1Id;
    const otherUser = await db.query.users.findFirst({
      where: eq(users.id, otherUserId),
    });
    return { ...m, otherUser };
  }));

  return matchDetails;
}
