'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function register(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  if (!email || !password || !name) {
    return { error: 'Toate câmpurile sunt obligatorii!' };
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    return { error: 'Acest email este deja folosit!' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [newUser] = await db.insert(users).values({
    email,
    password: hashedPassword,
    name,
  }).returning();

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId: newUser.id, expires });

  (await cookies()).set('session', session, { expires, httpOnly: true });
  
  redirect('/profile');
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user || !user.password) {
    return { error: 'Email sau parolă incorectă!' };
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return { error: 'Email sau parolă incorectă!' };
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId: user.id, expires });

  (await cookies()).set('session', session, { expires, httpOnly: true });
  
  redirect('/');
}

export async function logoutAction() {
  (await cookies()).set('session', '', { expires: new Date(0) });
  redirect('/');
}
