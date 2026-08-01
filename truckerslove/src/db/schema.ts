import { pgTable, serial, text, timestamp, integer, boolean, doublePrecision } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  password: text('password'),
  age: integer('age').default(25),
  email: text('email').unique().notNull(),
  emailVerified: timestamp('email_verified'),
  image: text('image'),
  images: text('images'),
  bio: text('bio'),
  truckModel: text('truck_model'),
  experience: text('experience'),
  hobbies: text('hobbies'),
  role: text('role').default('driver'),
  gender: text('gender'),
  lookingFor: text('looking_for'),
  currentParkingId: integer('current_parking_id'),
  routeStart: text('route_start'),
  routeEnd: text('route_end'),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  searchRadius: integer('search_radius').default(100),
  isAdmin: boolean('is_admin').default(false),
  lastActiveAt: timestamp('last_active_at').defaultNow(),
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
  type: text('type').notNull(),
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

export const profileVisits = pgTable('profile_visits', {
  id: serial('id').primaryKey(),
  visitorId: integer('visitor_id').references(() => users.id).notNull(),
  visitedId: integer('visited_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const blocks = pgTable('blocks', {
  id: serial('id').primaryKey(),
  blockerId: integer('blocker_id').references(() => users.id).notNull(),
  blockedId: integer('blocked_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const privateMessages = pgTable('private_messages', {
  id: serial('id').primaryKey(),
  matchId: integer('match_id').references(() => matches.id).notNull(),
  senderId: integer('sender_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const parkingMessages = pgTable('parking_messages', {
  id: serial('id').primaryKey(),
  parkingId: integer('parking_id').references(() => parkings.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const feedPosts = pgTable('feed_posts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  content: text('content'),
  image: text('image'),
  commentsBlocked: boolean('comments_blocked').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const feedComments = pgTable('feed_comments', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').references(() => feedPosts.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const feedLikes = pgTable('feed_likes', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').references(() => feedPosts.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  actorId: integer('actor_id').references(() => users.id).notNull(),
  type: text('type').notNull(),
  postId: integer('post_id'),
  read: boolean('read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// RELATIONS
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
  user: one(users, { fields: [globalMessages.userId], references: [users.id] }),
}));

export const swipesRelations = relations(swipes, ({ one }) => ({
  swiper: one(users, { fields: [swipes.swiperId], references: [users.id], relationName: 'swiper' }),
  swiped: one(users, { fields: [swipes.swipedId], references: [users.id], relationName: 'swiped' }),
}));

export const profileVisitsRelations = relations(profileVisits, ({ one }) => ({
  visitor: one(users, { fields: [profileVisits.visitorId], references: [users.id] }),
  visited: one(users, { fields: [profileVisits.visitedId], references: [users.id] }),
}));

export const parkingMessagesRelations = relations(parkingMessages, ({ one }) => ({
  user: one(users, { fields: [parkingMessages.userId], references: [users.id] }),
  parking: one(parkings, { fields: [parkingMessages.parkingId], references: [parkings.id] }),
}));

export const feedPostsRelations = relations(feedPosts, ({ one, many }) => ({
  user: one(users, { fields: [feedPosts.userId], references: [users.id] }),
  comments: many(feedComments),
  likes: many(feedLikes),
}));

export const feedCommentsRelations = relations(feedComments, ({ one }) => ({
  post: one(feedPosts, { fields: [feedComments.postId], references: [feedPosts.id] }),
  user: one(users, { fields: [feedComments.userId], references: [users.id] }),
}));

export const feedLikesRelations = relations(feedLikes, ({ one }) => ({
  post: one(feedPosts, { fields: [feedLikes.postId], references: [feedPosts.id] }),
  user: one(users, { fields: [feedLikes.userId], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
  actor: one(users, { fields: [notifications.actorId], references: [users.id] }),
}));
