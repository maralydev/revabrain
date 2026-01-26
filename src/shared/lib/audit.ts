'use server';

import { prisma } from './prisma';
import { getSession } from './auth';

export type ActieType =
  | 'LOGIN'
  | 'LOGOUT'
  | 'PATIENT_CREATE'
  | 'PATIENT_UPDATE'
  | 'PATIENT_DELETE'
  | 'PATIENT_EXPORT'
  | 'AFSPRAAK_CREATE'
  | 'AFSPRAAK_UPDATE'
  | 'AFSPRAAK_DELETE'
  | 'AFSPRAAK_CANCEL'
  | 'AFSPRAAK_STATUS'
  | 'AFSPRAAK_STATUS_CHANGE'
  | 'TEAMLID_CREATE'
  | 'TEAMLID_UPDATE'
  | 'TEAMLID_PASSWORD_RESET'
  | 'PASSWORD_RESET'
  | 'PASSWORD_CHANGE'
  | 'AFWEZIGHEID_CREATE'
  | 'AFWEZIGHEID_DELETE'
  | 'CONFIG_UPDATE'
  | 'EXPORT_GENERATED';

export interface AuditLogEntry {
  actieType: ActieType;
  entiteitType?: string;
  entiteitId?: number;
  omschrijving: string;
  metadata?: Record<string, any>;
}

/**
 * Log een actie naar de audit log
 * Haalt automatisch de huidige gebruiker op uit de sessie
 */
export async function logAudit(entry: AuditLogEntry): Promise<void> {
  try {
    const session = await getSession();

    if (!session) {
      console.warn('Audit log: Geen sessie gevonden');
      return;
    }

    await (prisma as any).auditLog.create({
      data: {
        timestamp: new Date(),
        teamlidId: session.userId,
        teamlidNaam: session.email, // Could be improved to fetch full name
        actieType: entry.actieType,
        entiteitType: entry.entiteitType || null,
        entiteitId: entry.entiteitId || null,
        omschrijving: entry.omschrijving,
        metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
      },
    });
  } catch (error) {
    // Don't throw - audit logging should not break application flow
    console.error('Audit log error:', error);
  }
}

/**
 * Helper om actie met entiteit te loggen
 */
export async function logEntityAction(
  actieType: ActieType,
  entiteitType: string,
  entiteitId: number,
  omschrijving: string,
  metadata?: Record<string, any>
): Promise<void> {
  return logAudit({
    actieType,
    entiteitType,
    entiteitId,
    omschrijving,
    metadata,
  });
}

export interface AuditLogDirectEntry {
  teamlidId: number;
  teamlidNaam: string;
  actieType: ActieType;
  entiteitType?: string;
  entiteitId?: number;
  omschrijving: string;
  metadata?: Record<string, any>;
}

/**
 * Log een actie direct met opgegeven teamlid (voor login/logout)
 * Gebruik wanneer sessie nog niet beschikbaar is (login) of net verwijderd wordt (logout)
 */
export async function logAuditDirect(entry: AuditLogDirectEntry): Promise<void> {
  try {
    await (prisma as any).auditLog.create({
      data: {
        timestamp: new Date(),
        teamlidId: entry.teamlidId,
        teamlidNaam: entry.teamlidNaam,
        actieType: entry.actieType,
        entiteitType: entry.entiteitType || null,
        entiteitId: entry.entiteitId || null,
        omschrijving: entry.omschrijving,
        metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
      },
    });
  } catch (error) {
    // Don't throw - audit logging should not break application flow
    console.error('Audit log error:', error);
  }
}
