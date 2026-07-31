import { db } from '@/db';
import { parkings, users } from '@/db/schema';
import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    console.log('Incepere configurare baza de date...');

    // 0. Create Tables if they don't exist (Raw SQL for safety)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS parkings (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        highway TEXT,
        country TEXT,
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION
      );

      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER DEFAULT 25,
        email TEXT UNIQUE NOT NULL,
        image TEXT,
        bio TEXT,
        truck_model TEXT,
        experience TEXT,
        hobbies TEXT,
        role TEXT DEFAULT 'driver',
        gender TEXT,
        looking_for TEXT,
        current_parking_id INTEGER REFERENCES parkings(id),
        route_start TEXT,
        route_end TEXT,
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        search_radius INTEGER DEFAULT 100,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS swipes (
        id SERIAL PRIMARY KEY,
        swiper_id INTEGER REFERENCES users(id) NOT NULL,
        swiped_id INTEGER REFERENCES users(id) NOT NULL,
        type TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS global_messages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        user1_id INTEGER REFERENCES users(id) NOT NULL,
        user2_id INTEGER REFERENCES users(id) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // 1. Seed Parkings (Daca nu exista)
    const parkingData = [
      { name: 'A1 - Nadlac II', highway: 'A1', country: 'Romania', latitude: 46.16, longitude: 20.72 },
      { name: 'A3 - Bors I', highway: 'A3', country: 'Romania', latitude: 47.12, longitude: 21.80 },
      { name: 'A1 - Arad South', highway: 'A1', country: 'Romania', latitude: 46.13, longitude: 21.32 },
      { name: 'A1 - Sibiu West', highway: 'A1', country: 'Romania', latitude: 45.79, longitude: 24.11 },
      { name: 'A2 - Constanta Port', highway: 'A2', country: 'Romania', latitude: 44.13, longitude: 28.60 },
      { name: 'A1 - Bucharest Entrance', highway: 'A1', country: 'Romania', latitude: 44.44, longitude: 25.92 },
      { name: 'A2 - Autohof Uhrsleben', highway: 'A2', country: 'Germany', latitude: 52.20, longitude: 11.26 },
      { name: 'A7 - Aire de Montélimar', highway: 'A7', country: 'France', latitude: 44.56, longitude: 4.75 },
      { name: 'AP-7 - La Jonquera', highway: 'AP-7', country: 'Spain', latitude: 42.41, longitude: 2.87 },
      { name: 'M6 - Corley Services', highway: 'M6', country: 'UK', latitude: 52.47, longitude: -1.51 },
    ];

    for (const p of parkingData) {
      await db.insert(parkings).values(p).onConflictDoNothing();
    }

    return NextResponse.json({ 
      status: 'Succes!', 
      message: 'Tabelele au fost populate cu parcări. Acum te poți loga.' 
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ 
      status: 'Eroare', 
      message: error.message 
    }, { status: 500 });
  }
}
