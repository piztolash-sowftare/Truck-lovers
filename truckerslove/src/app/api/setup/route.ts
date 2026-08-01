import { db } from '@/db';
import { parkings, users } from '@/db/schema';
import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    console.log('Incepere configurare baza de date...');

    // 0. Create Tables if they don't exist
    // Use individual statements to avoid multi-statement issues with some drivers/proxies
    const queries = [
      `CREATE TABLE IF NOT EXISTS parkings (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        highway TEXT,
        country TEXT,
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION
      )`,
      `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )`,
      `CREATE TABLE IF NOT EXISTS swipes (
        id SERIAL PRIMARY KEY,
        swiper_id INTEGER NOT NULL,
        swiped_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )`,
      `CREATE TABLE IF NOT EXISTS global_messages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )`,
      `CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        user1_id INTEGER NOT NULL,
        user2_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )`,
      `CREATE TABLE IF NOT EXISTS profile_visits (
        id SERIAL PRIMARY KEY,
        visitor_id INTEGER NOT NULL,
        visited_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )`,
      `CREATE TABLE IF NOT EXISTS private_messages (
        id SERIAL PRIMARY KEY,
        match_id INTEGER NOT NULL,
        sender_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )`,
      `CREATE TABLE IF NOT EXISTS parking_messages (
        id SERIAL PRIMARY KEY,
        parking_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )`,
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
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION`
    ];

    for (const q of queries) {
      try {
        await db.execute(sql.raw(q));
      } catch (e) {
        console.error('Query failed:', q, e);
      }
    }
    
    // 1. Seed Parkings
    const parkingData = [
      // ROMANIA
      { name: 'A1 - Nadlac II (Frontieră)', highway: 'A1', country: 'Romania', latitude: 46.16, longitude: 20.72 },
      { name: 'A1 - Arad South (OMV)', highway: 'A1', country: 'Romania', latitude: 46.13, longitude: 21.32 },
      { name: 'A1 - Pecica (Petrom)', highway: 'A1', country: 'Romania', latitude: 46.21, longitude: 21.05 },
      { name: 'A1 - Deva East (Simeria)', highway: 'A1', country: 'Romania', latitude: 45.91, longitude: 22.95 },
      { name: 'A1 - Orăștie West', highway: 'A1', country: 'Romania', latitude: 45.84, longitude: 23.18 },
      { name: 'A1 - Sebeș South', highway: 'A1', country: 'Romania', latitude: 45.94, longitude: 23.56 },
      { name: 'A1 - Sibiu West (Cristian)', highway: 'A1', country: 'Romania', latitude: 45.79, longitude: 24.11 },
      { name: 'A1 - Sibiu East (Seliște)', highway: 'A1', country: 'Romania', latitude: 45.81, longitude: 23.95 },
      { name: 'A1 - Pitești South (Bascov)', highway: 'A1', country: 'Romania', latitude: 44.88, longitude: 24.84 },
      { name: 'A1 - KM 36 (Căscioarele)', highway: 'A1', country: 'Romania', latitude: 44.45, longitude: 25.68 },
      { name: 'A1 - Intrare București (Militari)', highway: 'A1', country: 'Romania', latitude: 44.44, longitude: 25.92 },
      { name: 'A2 - KM 19 (Cernica)', highway: 'A2', country: 'Romania', latitude: 44.41, longitude: 26.25 },
      { name: 'A2 - KM 88 (Drajna)', highway: 'A2', country: 'Romania', latitude: 44.42, longitude: 27.25 },
      { name: 'A2 - KM 139 (Fetești)', highway: 'A2', country: 'Romania', latitude: 44.38, longitude: 27.82 },
      { name: 'A2 - Constanța Port (Agigea)', highway: 'A2', country: 'Romania', latitude: 44.13, longitude: 28.60 },
      { name: 'A3 - Borș I (Frontieră)', highway: 'A3', country: 'Romania', latitude: 47.12, longitude: 21.80 },
      { name: 'A3 - Gilău (Cluj)', highway: 'A3', country: 'Romania', latitude: 46.75, longitude: 23.38 },
      { name: 'A3 - Turda North', highway: 'A3', country: 'Romania', latitude: 46.61, longitude: 23.75 },
      { name: 'DN1 - Satu Mare Entrance', highway: 'DN1', country: 'Romania', latitude: 47.79, longitude: 22.87 },
      { name: 'DN19 - Satu Mare West', highway: 'DN19', country: 'Romania', latitude: 47.78, longitude: 22.82 },
      { name: 'E85 - Suceava North', highway: 'E85', country: 'Romania', latitude: 47.66, longitude: 26.25 },
      { name: 'DN7 - Valea Oltului (Dedulești)', highway: 'DN7', country: 'Romania', latitude: 45.05, longitude: 24.52 },
      
      // GERMANY
      { name: 'A2 - Autohof Uhrsleben', highway: 'A2', country: 'Germany', latitude: 52.20, longitude: 11.26 },
      { name: 'A2 - Gütersloh North', highway: 'A2', country: 'Germany', latitude: 51.91, longitude: 8.42 },
      { name: 'A3 - Autohof Geiselwind', highway: 'A3', country: 'Germany', latitude: 49.77, longitude: 10.47 },
      { name: 'A7 - Autohof Kassel', highway: 'A7', country: 'Germany', latitude: 51.27, longitude: 9.53 },
      { name: 'A8 - Autohof Sulzemoos', highway: 'A8', country: 'Germany', latitude: 48.28, longitude: 11.26 },
      { name: 'A9 - Autohof Münchberg', highway: 'A9', country: 'Germany', latitude: 50.18, longitude: 11.78 },
      
      // FRANCE
      { name: 'A1 - Aire de Ressons', highway: 'A1', country: 'France', latitude: 49.49, longitude: 2.76 },
      { name: 'A7 - Aire de Montélimar', highway: 'A7', country: 'France', latitude: 44.56, longitude: 4.75 },
      { name: 'A9 - Aire du Village Catalan', highway: 'A9', country: 'France', latitude: 42.59, longitude: 2.85 },
      { name: 'A10 - Cestas Bordeaux', highway: 'A10', country: 'France', latitude: 44.73, longitude: -0.70 },
      
      // HUNGARY
      { name: 'M0 - Annahegyi pihenőhely', highway: 'M0', country: 'Hungary', latitude: 47.39, longitude: 19.01 },
      { name: 'M1 - Hegyeshalom (Frontieră)', highway: 'M1', country: 'Hungary', latitude: 47.91, longitude: 17.15 },
      { name: 'M5 - Kecskemét South', highway: 'M5', country: 'Hungary', latitude: 46.85, longitude: 19.68 },
      { name: 'M7 - Balaton North', highway: 'M7', country: 'Hungary', latitude: 46.95, longitude: 18.05 },
      
      // AUSTRIA / ITALY
      { name: 'A12 - Autohof Inntal', highway: 'A12', country: 'Austria', latitude: 47.23, longitude: 11.45 },
      { name: 'A22 - Brennero Truck Park', highway: 'A22', country: 'Italy', latitude: 47.01, longitude: 11.51 },
      { name: 'A1 - Secchia Ovest (Modena)', highway: 'A1', country: 'Italy', latitude: 44.69, longitude: 10.87 },
    ];

    for (const p of parkingData) {
      await db.insert(parkings).values(p).onConflictDoNothing();
    }

    return NextResponse.json({ 
      status: 'BRAVO BOSS AI FACUT BINE!', 
      message: 'Totul este pregătit. Acum te poți loga sau înregistra.' 
    });
  } catch (error: any) {
    console.error('Setup overall failure:', error);
    return NextResponse.json({ 
      status: 'Eroare la setup', 
      message: error.message 
    }, { status: 500 });
  }
}
