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
  const gender = formData.get('gender') as string;
  const lookingFor = formData.get('lookingFor') as string;

  if (!email || !password || !name || !gender || !lookingFor) {
    return { error: 'Toate câmpurile sunt obligatorii!' };
  }

  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return { error: 'Acest email este deja folosit!' };
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    
    const [newUser] = await db.insert(users).values({
      email,
      password: hashedPassword,
      name,
      gender,
      lookingFor,
    }).returning();

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const sessionToken = await encrypt({ userId: newUser.id, expires });

    (await cookies()).set('session', sessionToken, { 
      expires, 
      httpOnly: true, 
      path: '/', 
      secure: true, 
      sameSite: 'lax' 
    });
  } catch (err: any) {
    console.error('Registration error details:', err);
    return { error: 'Eroare la baza de date: ' + (err.message || 'Conexiune refuzată') };
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
      return { error: 'Email sau parolă incorectă!' };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { error: 'Email sau parolă incorectă!' };
    }

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const sessionToken = await encrypt({ userId: user.id, expires });

    (await cookies()).set('session', sessionToken, { 
      expires, 
      httpOnly: true, 
      path: '/', 
      secure: true, 
      sameSite: 'lax' 
    });
  } catch (err: any) {
    console.error('Login error details:', err);
    return { error: 'Eroare la autentificare: ' + (err.message || 'Verifică datele') };
  }
  
  redirect('/');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.set('session', '', { expires: new Date(0), path: '/' });
  redirect('/');
}
