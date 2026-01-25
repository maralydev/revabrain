'use server';

import { prisma } from '@/shared/lib/prisma';
import { requireZorgverlener } from '@/shared/lib/auth';

export interface AuditLogData {
  id: number;
  timestamp: Date;
  teamlidId: number;
  teamlidNaam: string;
  actieType: string;
  entiteitType: string | null;
  entiteitId: number | null;
  omschrijving: string;
  metadata: string | null;
}

export interface AuditLogFilters {
  startDatum?: Date;
  eindDatum?: Date;
  teamlidId?: number;
  actieType?: string;
  limit?: number;
  offset?: number;
}

/**
 * Haal audit logs op met filters (admin only)
 */
export async function getAuditLogs(
  filters: AuditLogFilters = {}
): Promise<{ logs: AuditLogData[]; totaal: number }> {
  const session = await requireZorgverlener();

  // Check admin toegang
  if (!session.isAdmin) {
    throw new Error('Alleen admins kunnen audit logs bekijken');
  }

  const whereClause: any = {};

  // Filters toepassen
  if (filters.startDatum || filters.eindDatum) {
    whereClause.timestamp = {};
    if (filters.startDatum) whereClause.timestamp.gte = filters.startDatum;
    if (filters.eindDatum) whereClause.timestamp.lte = filters.eindDatum;
  }

  if (filters.teamlidId) {
    whereClause.teamlidId = filters.teamlidId;
  }

  if (filters.actieType) {
    whereClause.actieType = filters.actieType;
  }

  // Count total
  const totaal = await (prisma as any).auditLog.count({ where: whereClause });

  // Haal logs op met paginatie
  const logs = await (prisma as any).auditLog.findMany({
    where: whereClause,
    orderBy: { timestamp: 'desc' },
    take: filters.limit || 100,
    skip: filters.offset || 0,
  });

  return { logs, totaal };
}

/**
 * Haal alle unieke actie types op (voor filter dropdown)
 */
export async function getActieTypes(): Promise<string[]> {
  const session = await requireZorgverlener();

  if (!session.isAdmin) {
    throw new Error('Alleen admins kunnen audit logs bekijken');
  }

  const results = await (prisma as any).auditLog.findMany({
    select: { actieType: true },
    distinct: ['actieType'],
    orderBy: { actieType: 'asc' },
  });

  return results.map((r: any) => r.actieType);
}
