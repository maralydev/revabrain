import { hash, compare } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// Types
export type Rol = 'ZORGVERLENER' | 'SECRETARIAAT';

export interface SessionPayload {
  userId: number;
  email: string;
  rol: string; // ZORGVERLENER | SECRETARIAAT
  isAdmin: boolean;
}

// Config
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const SESSION_COOKIE_NAME = 'revabrain_session';
const SESSION_DURATION = 7 * 24 * 60 * 60; // 7 dagen in seconden

/**
 * Hash een wachtwoord met bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

/**
 * Verifieer een wachtwoord tegen een hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

/**
 * Creëer een JWT session token
 */
export async function createSession(payload: SessionPayload): Promise<string> {
  const token = await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verifieer en decode een JWT token
 */
export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Haal de huidige sessie op uit cookies
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifySession(token);
}

/**
 * Sla een sessie op in cookies
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  });
}

/**
 * Verwijder sessie cookie
 */
export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Check of user admin rechten heeft
 */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();

  if (!session) {
    throw new Error('Niet ingelogd');
  }

  if (!session.isAdmin) {
    throw new Error('Geen admin rechten');
  }

  return session;
}

/**
 * Check of user een zorgverlener is
 */
export async function requireZorgverlener(): Promise<SessionPayload> {
  const session = await getSession();

  if (!session) {
    throw new Error('Niet ingelogd');
  }

  if (session.rol !== 'ZORGVERLENER' && !session.isAdmin) {
    throw new Error('Alleen zorgverleners hebben toegang');
  }

  return session;
}
