'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/shared/lib/prisma';
import {
  verifyPassword,
  createSession,
  setSessionCookie,
  deleteSessionCookie,
} from '@/shared/lib/auth';

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
      rol: user.rol,
      isAdmin: user.isAdmin,
    };

    const token = await createSession(sessionPayload);
    await setSessionCookie(token);

    // Check if user must change password
    const mustChangePassword = (user as any).mustChangePassword || false;

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
export async function logout(): Promise<void> {
  await deleteSessionCookie();
  redirect('/login');
}
