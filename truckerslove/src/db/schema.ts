import { pgTable, serial, text, timestamp, integer, boolean, doublePrecision } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  password: text('password'),
  age: integer('age').default(25),
  email: text('email').unique().notNull(),
  emailVerified: timestamp('email_verified'),
  image: text('image'),
  bio: text('bio'),
  truckModel: text('truck_model'),
  experience: text('experience'),
  hobbies: text('hobbies'),
  role: text('role').default('driver'), // 'driver' or 'admirer'
  gender: text('gender'), // 'male', 'female', 'other'
  lookingFor: text('looking_for'), // 'male', 'female', 'both'
  currentParkingId: integer('current_parking_id').references(() => parkings.id),
  routeStart: text('route_start'),
  routeEnd: text('route_end'),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  searchRadius: integer('search_radius').default(100),
  createdAt: timestamp('created_at').defaultNow(),
});

export const parkings = pgTable('parkings', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  highway: text('highway'),
  country: text('country'),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
});

export const swipes = pgTable('swipes', {
  id: serial('id').primaryKey(),
  swiperId: integer('swiper_id').references(() => users.id).notNull(),
  swipedId: integer('swiped_id').references(() => users.id).notNull(),
  type: text('type').notNull(), // 'like' or 'dislike'
  createdAt: timestamp('created_at').defaultNow(),
});

export const globalMessages = pgTable('global_messages', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  user1Id: integer('user1_id').references(() => users.id).notNull(),
  user2Id: integer('user2_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const privateMessages = pgTable('private_messages', {
  id: serial('id').primaryKey(),
  matchId: integer('match_id').references(() => matches.id).notNull(),
  senderId: integer('sender_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

import { relations } from 'drizzle-orm';

export const usersRelations = relations(users, ({ many, one }) => ({
  swipes: many(swipes, { relationName: 'swiper' }),
  receivedSwipes: many(swipes, { relationName: 'swiped' }),
  globalMessages: many(globalMessages),
  parking: one(parkings, {
    fields: [users.currentParkingId],
    references: [parkings.id],
  }),
}));

export const globalMessagesRelations = relations(globalMessages, ({ one }) => ({
  user: one(users, {
    fields: [globalMessages.userId],
    references: [users.id],
  }),
}));

export const swipesRelations = relations(swipes, ({ one }) => ({
  swiper: one(users, {
    fields: [swipes.swiperId],
    references: [users.id],
    relationName: 'swiper',
  }),
  swiped: one(users, {
    fields: [swipes.swipedId],
    references: [users.id],
    relationName: 'swiped',
  }),
}));
