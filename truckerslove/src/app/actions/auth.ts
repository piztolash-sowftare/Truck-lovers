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

  let newUser;
  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return { error: 'Acest email este deja folosit!' };
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    
    [newUser] = await db.insert(users).values({
      email,
      password: hashedPassword,
      name,
    }).returning();

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const sessionToken = await encrypt({ userId: newUser.id, expires });

    (await cookies()).set('session', sessionToken, { expires, httpOnly: true, path: '/', secure: true, sameSite: 'lax' });
  } catch (err) {
    console.error('Registration error:', err);
    return { error: 'Eroare la conexiunea cu baza de date.' };
  }
  
  redirect('/profile');
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Introdu email și parolă!' };
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user || !user.password) {
      return { error: 'Utilizator negăsit sau parolă nesetată!' };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { error: 'Parolă incorectă!' };
    }

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const sessionToken = await encrypt({ userId: user.id, expires });

    (await cookies()).set('session', sessionToken, { expires, httpOnly: true, path: '/', secure: true, sameSite: 'lax' });
  } catch (err) {
    console.error('Login error:', err);
    return { error: 'Eroare la autentificare.' };
  }
  
  redirect('/');
}

export async function logoutAction() {
  (await cookies()).set('session', '', { expires: new Date(0) });
  redirect('/');
}
