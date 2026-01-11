'use server';

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = new TextEncoder().encode('your-secret-key-change-this-in-production');

export async function loginAction(username: string, password: string): Promise<{ success: boolean; message?: string }> {
  // Mock authentication logic
  if (username === 'admin' && password === '123') {
    // Generate JWT
    const token = await new SignJWT({ username, role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h') // Token expires in 24 hour
      .sign(SECRET_KEY);

    // Store JWT in cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie (read-only for client)
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600*24, // 24 hours
      path: '/',
    });

    return { success: true };
  } else {
    return { success: false, message: 'Invalid credentials' };
  }
}

export async function getSessionAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return { user: { id: payload.username as string, name: payload.username as string } };
  } catch (error) {
    return null;
  }
}

export async function isLoggedIn() {
  const session = await getSessionAction();
  return !!session;
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}
