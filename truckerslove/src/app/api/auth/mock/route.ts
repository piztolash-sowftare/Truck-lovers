import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  try {
    let user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      // Create a dummy user if not found
      const [newUser] = await db.insert(users).values({
        name: email.split('@')[0],
        email: email,
        age: 30,
        role: 'driver',
        gender: 'male',
        lookingFor: 'female',
      }).returning();
      user = newUser;
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
