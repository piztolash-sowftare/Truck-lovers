'use strict';
'use server';

import { db } from '@/db';
import { users, swipes, globalMessages, parkings, matches, privateMessages } from '@/db/schema';
import { eq, ne, and, or, sql, inArray, not } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Mock user ID for the demo
const CURRENT_USER_ID = 1;

export async function getUsersToSwipe(filters: { 
  mode?: 'all' | 'route' | 'nearby', 
  gender?: string, 
  minAge?: number, 
  maxAge?: number 
} = {}) {
  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, CURRENT_USER_ID),
  });

  if (!currentUser) return [];

  const swipedRes = await db.select({ id: swipes.swipedId })
    .from(swipes)
    .where(eq(swipes.swiperId, CURRENT_USER_ID));

  const excludedIds = [CURRENT_USER_ID, ...swipedRes.map(s => s.id)];

  let conditions = [not(inArray(users.id, excludedIds))];

  // Gender Filter
  if (filters.gender && filters.gender !== 'both') {
    conditions.push(eq(users.gender, filters.gender));
  }

  // Age Filter
  if (filters.minAge) conditions.push(sql`${users.age} >= ${filters.minAge}`);
  if (filters.maxAge) conditions.push(sql`${users.age} <= ${filters.maxAge}`);

  // Mode Filter
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

export async function uploadProfileImage(url?: string) {
  // In a real app, you would use a service like Cloudinary or AWS S3.
  // For now, we use a high-quality truck driver placeholder if no URL is provided.
  const defaultImage = "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400";
  
  await db.update(users)
    .set({ image: url || defaultImage })
    .where(eq(users.id, CURRENT_USER_ID));
  revalidatePath('/profile');
}

export async function swipeUser(targetId: number, type: 'like' | 'dislike') {
  await db.insert(swipes).values({
    swiperId: CURRENT_USER_ID,
    swipedId: targetId,
    type,
  });

  if (type === 'like') {
    // Check if it's a match
    const reciprocalSwipe = await db.query.swipes.findFirst({
      where: and(
        eq(swipes.swiperId, targetId),
        eq(swipes.swipedId, CURRENT_USER_ID),
        eq(swipes.type, 'like')
      ),
    });

    if (reciprocalSwipe) {
      await db.insert(matches).values({
        user1Id: Math.min(CURRENT_USER_ID, targetId),
        user2Id: Math.max(CURRENT_USER_ID, targetId),
      });
      return { match: true };
    }
  }

  revalidatePath('/');
  return { match: false };
}

export async function sendGlobalMessage(content: string) {
  await db.insert(globalMessages).values({
    userId: CURRENT_USER_ID,
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
  await db.update(users)
    .set({ currentParkingId: parkingId })
    .where(eq(users.id, CURRENT_USER_ID));
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
  lookingFor?: string
}) {
  await db.update(users)
    .set(data)
    .where(eq(users.id, CURRENT_USER_ID));
  revalidatePath('/profile');
}

export async function getMatches() {
  const userMatches = await db.query.matches.findMany({
    where: or(
      eq(matches.user1Id, CURRENT_USER_ID),
      eq(matches.user2Id, CURRENT_USER_ID)
    ),
  });

  const matchDetails = await Promise.all(userMatches.map(async (m: any) => {
    const otherUserId = m.user1Id === CURRENT_USER_ID ? m.user2Id : m.user1Id;
    const otherUser = await db.query.users.findFirst({
      where: eq(users.id, otherUserId),
    });
    return { ...m, otherUser };
  }));

  return matchDetails;
}
