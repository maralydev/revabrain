'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/shared/lib/prisma';
import {
  verifyPassword,
  createSession,
  setSessionCookie,
  deleteSessionCookie,
  getSession,
} from '@/shared/lib/auth';
import { logAuditDirect } from '@/shared/lib/audit';

export interface LoginResult {
  success: boolean;
  error?: string;
  mustChangePassword?: boolean;
}

/**
 * Login server action
 */
export async function login(email: string, password: string): Promise<LoginResult> {
  try {
    // Validatie
    if (!email || !password) {
      return { success: false, error: 'Email en wachtwoord zijn verplicht' };
    }

    // Zoek gebruiker
    const user = await prisma.teamlid.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return { success: false, error: 'Ongeldige inloggegevens' };
    }

    // Check of user actief is
    if (!user.actief) {
      return { success: false, error: 'Account is gedeactiveerd' };
    }

    // Verifieer wachtwoord
    const isValid = await verifyPassword(password, user.wachtwoord);

    if (!isValid) {
      return { success: false, error: 'Ongeldige inloggegevens' };
    }

    // Creëer sessie
    const sessionPayload = {
      userId: user.id,
      email: user.email,
      voornaam: user.voornaam,
      achternaam: user.achternaam,
      isAdmin: user.isAdmin,
      mustChangePassword: user.mustChangePassword || false,
    };

    const token = await createSession(sessionPayload);
    await setSessionCookie(token);

    // Check if user must change password
    const mustChangePassword = user.mustChangePassword || false;

    // Audit log (direct because we just created the session)
    await logAuditDirect({
      teamlidId: user.id,
      teamlidNaam: `${user.voornaam} ${user.achternaam}`,
      actieType: 'LOGIN',
      omschrijving: `Ingelogd`,
    });

    return {
      success: true,
      mustChangePassword,
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Er is een fout opgetreden' };
  }
}

/**
 * Logout server action
 */
export async function logout() {
  const session = await getSession();
  
  if (session) {
    await logAuditDirect({
      teamlidId: session.userId,
      teamlidNaam: `${session.voornaam} ${session.achternaam}`,
      actieType: 'LOGOUT',
      omschrijving: `Uitgelogd`,
    });
  }
  
  await deleteSessionCookie();
  redirect('/login');
}

/**
 * Check if user is authenticated
 */
export async function checkAuth() {
  const session = await getSession();
  return !!session;
}
