import { db } from '@/db';
import { parkings, users } from '@/db/schema';
import { NextResponse, NextRequest } from 'next/server';
import { sql, eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const adminEmail = searchParams.get('makeAdmin');

    if (adminEmail) {
      await db.update(users).set({ isAdmin: true }).where(eq(users.email, adminEmail));
      return NextResponse.json({ message: `BRAVO BOSS! ${adminEmail} este acum ADMIN.` });
    }

    console.log('Incepere configurare baza de date...');

    const queries = [
      `CREATE TABLE IF NOT EXISTS parkings (id SERIAL PRIMARY KEY, name TEXT NOT NULL, highway TEXT, country TEXT, latitude DOUBLE PRECISION, longitude DOUBLE PRECISION)`,
      `CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, created_at TIMESTAMP DEFAULT NOW())`,
      `CREATE TABLE IF NOT EXISTS swipes (id SERIAL PRIMARY KEY, swiper_id INTEGER NOT NULL, swiped_id INTEGER NOT NULL, type TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW())`,
      `CREATE TABLE IF NOT EXISTS global_messages (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL, content TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW())`,
      `CREATE TABLE IF NOT EXISTS matches (id SERIAL PRIMARY KEY, user1_id INTEGER NOT NULL, user2_id INTEGER NOT NULL, created_at TIMESTAMP DEFAULT NOW())`,
      `CREATE TABLE IF NOT EXISTS profile_visits (id SERIAL PRIMARY KEY, visitor_id INTEGER NOT NULL, visited_id INTEGER NOT NULL, created_at TIMESTAMP DEFAULT NOW())`,
      `CREATE TABLE IF NOT EXISTS blocks (id SERIAL PRIMARY KEY, blocker_id INTEGER NOT NULL, blocked_id INTEGER NOT NULL, created_at TIMESTAMP DEFAULT NOW())`,
      `CREATE TABLE IF NOT EXISTS private_messages (id SERIAL PRIMARY KEY, match_id INTEGER NOT NULL, sender_id INTEGER NOT NULL, content TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW())`,
      `CREATE TABLE IF NOT EXISTS parking_messages (id SERIAL PRIMARY KEY, parking_id INTEGER NOT NULL, user_id INTEGER NOT NULL, content TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW())`,
      `CREATE TABLE IF NOT EXISTS feed_posts (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL, content TEXT, image TEXT, comments_blocked BOOLEAN DEFAULT FALSE, created_at TIMESTAMP DEFAULT NOW())`,
      `CREATE TABLE IF NOT EXISTS feed_comments (id SERIAL PRIMARY KEY, post_id INTEGER NOT NULL, user_id INTEGER NOT NULL, content TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW())`,
      `CREATE TABLE IF NOT EXISTS feed_likes (id SERIAL PRIMARY KEY, post_id INTEGER NOT NULL, user_id INTEGER NOT NULL, created_at TIMESTAMP DEFAULT NOW())`,
      `CREATE TABLE IF NOT EXISTS notifications (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL, actor_id INTEGER NOT NULL, type TEXT NOT NULL, post_id INTEGER, read BOOLEAN DEFAULT FALSE, created_at TIMESTAMP DEFAULT NOW())`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS age INTEGER DEFAULT 25`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified TIMESTAMP`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS image TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS truck_model TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS experience TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS hobbies TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'driver'`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS gender TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS looking_for TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS current_parking_id INTEGER`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS route_start TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS route_end TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS search_radius INTEGER DEFAULT 100`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS images TEXT DEFAULT '[]'`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE`
    ];

    for (const q of queries) {
      try {
        await db.execute(sql.raw(q));
      } catch (e) {}
    }
    
    const parkingData = [
      { name: 'Satu Mare - OMV Intrare', highway: 'DN19', country: 'Romania', latitude: 47.7812, longitude: 22.8631 },
      { name: 'A1 - Nadlac II (Vamă)', highway: 'A1', country: 'Romania', latitude: 46.1662, longitude: 20.7265 },
      { name: 'A1 - Arad South (OMV)', highway: 'A1', country: 'Romania', latitude: 46.1342, longitude: 21.3289 },
      { name: 'A1 - Sibiu Cristian (OMV)', highway: 'A1', country: 'Romania', latitude: 45.7925, longitude: 24.0345 },
      { name: 'A1 - Bascov Pitesti', highway: 'A1', country: 'Romania', latitude: 44.8890, longitude: 24.8456 },
      { name: 'A1 - Militari Bucharest', highway: 'A1', country: 'Romania', latitude: 44.4423, longitude: 25.9234 },
      { name: 'A2 - KM 139 Fetesti', highway: 'A2', country: 'Romania', latitude: 44.3890, longitude: 27.8234 },
      { name: 'A3 - Bors II (Vamă Nouă)', highway: 'A3', country: 'Romania', latitude: 47.1235, longitude: 21.8021 },
      { name: 'M1 - Hegyeshalom (Vamă)', highway: 'M1', country: 'Hungary', latitude: 47.9123, longitude: 17.1567 },
      { name: 'A2 - Autohof Uhrsleben', highway: 'A2', country: 'Germany', latitude: 52.2012, longitude: 11.2678 },
    ];

    for (const p of parkingData) {
      await db.insert(parkings).values(p).onConflictDoNothing();
    }

    return NextResponse.json({ 
      status: 'BRAVO BOSS AI FACUT BINE!', 
      message: 'Totul este pregătit pentru TruckLovers Elite.' 
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'Eroare', message: error.message }, { status: 500 });
  }
}
