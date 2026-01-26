'use server';

import { requireZorgverlener } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';
import { logAudit } from '@/shared/lib/audit';
import bcrypt from 'bcryptjs';

export type Rol = 'ZORGVERLENER' | 'SECRETARIAAT';
export type Discipline = 'LOGOPEDIE' | 'KINESITHERAPIE' | 'ERGOTHERAPIE' | 'NEUROPSYCHOLOGIE' | 'DIETIEK';

export interface CreateTeamlidInput {
  voornaam: string;
  achternaam: string;
  email: string;
  wachtwoord: string;
  rol: Rol;
  discipline?: Discipline;
  isAdmin?: boolean;
  actief?: boolean;
  bio?: string;
  foto?: string;
}

export interface CreateTeamlidResult {
  success: boolean;
  error?: string;
  teamlidId?: number;
}

export interface UpdateTeamlidInput {
  teamlidId: number;
  voornaam?: string;
  achternaam?: string;
  email?: string;
  rol?: Rol;
  discipline?: Discipline;
  isAdmin?: boolean;
  actief?: boolean;
  bio?: string;
  foto?: string;
}

export interface UpdateTeamlidResult {
  success: boolean;
  error?: string;
}

export interface ResetPasswordResult {
  success: boolean;
  error?: string;
  tijdelijkWachtwoord?: string;
}

/**
 * Maak een nieuw teamlid aan (admin only)
 */
export async function createTeamlid(
  input: CreateTeamlidInput
): Promise<CreateTeamlidResult> {
  try {
    const session = await requireZorgverlener();

    // Check admin toegang
    if (!session.isAdmin) {
      return { success: false, error: 'Alleen admins kunnen teamleden aanmaken' };
    }

    // Validatie
    if (!input.voornaam || !input.achternaam || !input.email || !input.wachtwoord || !input.rol) {
      return { success: false, error: 'Verplichte velden ontbreken' };
    }

    // Check of email al bestaat
    const bestaand = await prisma.teamlid.findUnique({
      where: { email: input.email },
    });

    if (bestaand) {
      return { success: false, error: 'Email adres is al in gebruik' };
    }

    // Hash wachtwoord
    const hashedPassword = await bcrypt.hash(input.wachtwoord, 10);

    // Maak teamlid aan
    const teamlid = await prisma.teamlid.create({
      data: {
        voornaam: input.voornaam,
        achternaam: input.achternaam,
        email: input.email,
        wachtwoord: hashedPassword,
        rol: input.rol,
        discipline: input.discipline || null,
        isAdmin: input.isAdmin || false,
        actief: input.actief !== undefined ? input.actief : true,
        bio: input.bio || null,
        foto: input.foto || null,
      },
    });

    // Audit log
    await logAudit({
      actieType: 'TEAMLID_CREATE',
      entiteitType: 'Teamlid',
      entiteitId: teamlid.id,
      omschrijving: `Teamlid aangemaakt: ${input.voornaam} ${input.achternaam} (${input.rol})`,
    });

    return {
      success: true,
      teamlidId: teamlid.id,
    };
  } catch (error) {
    console.error('Create teamlid error:', error);
    return { success: false, error: 'Er is een fout opgetreden' };
  }
}

/**
 * Update een bestaand teamlid (admin only)
 */
export async function updateTeamlid(
  input: UpdateTeamlidInput
): Promise<UpdateTeamlidResult> {
  try {
    const session = await requireZorgverlener();

    // Check admin toegang
    if (!session.isAdmin) {
      return { success: false, error: 'Alleen admins kunnen teamleden wijzigen' };
    }

    // Validatie
    if (!input.teamlidId) {
      return { success: false, error: 'Teamlid ID ontbreekt' };
    }

    // Haal bestaand teamlid op
    const bestaandTeamlid = await prisma.teamlid.findUnique({
      where: { id: input.teamlidId },
    });

    if (!bestaandTeamlid) {
      return { success: false, error: 'Teamlid niet gevonden' };
    }

    // Check email conflict
    if (input.email && input.email !== bestaandTeamlid.email) {
      const emailInGebruik = await prisma.teamlid.findUnique({
        where: { email: input.email },
      });

      if (emailInGebruik) {
        return { success: false, error: 'Email adres is al in gebruik' };
      }
    }

    // Update teamlid
    await prisma.teamlid.update({
      where: { id: input.teamlidId },
      data: {
        ...(input.voornaam && { voornaam: input.voornaam }),
        ...(input.achternaam && { achternaam: input.achternaam }),
        ...(input.email && { email: input.email }),
        ...(input.rol && { rol: input.rol }),
        ...(input.discipline !== undefined && { discipline: input.discipline || null }),
        ...(input.isAdmin !== undefined && { isAdmin: input.isAdmin }),
        ...(input.actief !== undefined && { actief: input.actief }),
        ...(input.bio !== undefined && { bio: input.bio || null }),
        ...(input.foto !== undefined && { foto: input.foto || null }),
      },
    });

    // Audit log
    await logAudit({
      actieType: 'TEAMLID_UPDATE',
      entiteitType: 'Teamlid',
      entiteitId: input.teamlidId,
      omschrijving: `Teamlid gewijzigd: ${bestaandTeamlid.voornaam} ${bestaandTeamlid.achternaam}`,
    });

    return { success: true };
  } catch (error) {
    console.error('Update teamlid error:', error);
    return { success: false, error: 'Er is een fout opgetreden' };
  }
}

/**
 * Reset wachtwoord van een teamlid (admin only)
 */
export async function resetPassword(
  teamlidId: number
): Promise<ResetPasswordResult> {
  try {
    const session = await requireZorgverlener();

    // Check admin toegang
    if (!session.isAdmin) {
      return { success: false, error: 'Alleen admins kunnen wachtwoorden resetten' };
    }

    // Genereer tijdelijk wachtwoord (8 random characters)
    const tijdelijk = Math.random().toString(36).substring(2, 10);
    const hashedPassword = await bcrypt.hash(tijdelijk, 10);

    // Update wachtwoord and force password change
    await (prisma as any).teamlid.update({
      where: { id: teamlidId },
      data: {
        wachtwoord: hashedPassword,
        mustChangePassword: true,
      },
    });

    // Audit log
    await logAudit({
      actieType: 'PASSWORD_RESET',
      entiteitType: 'Teamlid',
      entiteitId: teamlidId,
      omschrijving: `Wachtwoord gereset door admin`,
    });

    return {
      success: true,
      tijdelijkWachtwoord: tijdelijk,
    };
  } catch (error) {
    console.error('Reset password error:', error);
    return { success: false, error: 'Er is een fout opgetreden' };
  }
}

/**
 * Deactiveer een teamlid (admin only)
 */
export async function deactivateTeamlid(
  teamlidId: number
): Promise<UpdateTeamlidResult> {
  return updateTeamlid({ teamlidId, actief: false });
}

/**
 * Activeer een teamlid (admin only)
 */
export async function activateTeamlid(
  teamlidId: number
): Promise<UpdateTeamlidResult> {
  return updateTeamlid({ teamlidId, actief: true });
}

export interface ChangePasswordInput {
  huidigWachtwoord: string;
  nieuwWachtwoord: string;
}

export interface ChangePasswordResult {
  success: boolean;
  error?: string;
}

/**
 * Wijzig eigen wachtwoord (alle gebruikers)
 */
export async function changePassword(
  input: ChangePasswordInput
): Promise<ChangePasswordResult> {
  try {
    const session = await requireZorgverlener();

    // Validatie
    if (!input.huidigWachtwoord || !input.nieuwWachtwoord) {
      return { success: false, error: 'Alle velden zijn verplicht' };
    }

    if (input.nieuwWachtwoord.length < 8) {
      return { success: false, error: 'Nieuw wachtwoord moet minimaal 8 karakters zijn' };
    }

    // Haal huidige teamlid op
    const teamlid = await prisma.teamlid.findUnique({
      where: { id: session.userId },
    });

    if (!teamlid) {
      return { success: false, error: 'Teamlid niet gevonden' };
    }

    // Verifieer huidig wachtwoord
    const isValid = await bcrypt.compare(input.huidigWachtwoord, teamlid.wachtwoord);

    if (!isValid) {
      return { success: false, error: 'Huidig wachtwoord is onjuist' };
    }

    // Hash nieuw wachtwoord
    const hashedPassword = await bcrypt.hash(input.nieuwWachtwoord, 10);

    // Update wachtwoord en reset mustChangePassword flag
    await (prisma as any).teamlid.update({
      where: { id: session.userId },
      data: {
        wachtwoord: hashedPassword,
        mustChangePassword: false,
      },
    });

    // Audit log
    await logAudit({
      actieType: 'PASSWORD_CHANGE',
      entiteitType: 'Teamlid',
      entiteitId: session.userId,
      omschrijving: `Wachtwoord gewijzigd door gebruiker`,
    });

    return { success: true };
  } catch (error) {
    console.error('Change password error:', error);
    return { success: false, error: 'Er is een fout opgetreden' };
  }
}
