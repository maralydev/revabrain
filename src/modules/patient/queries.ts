'use server';

import { Patient } from '@prisma/client';
import { prisma } from '@/shared/lib/prisma';
import { requireZorgverlener } from '@/shared/lib/auth';

export async function getRecentPatients(limit: number = 50): Promise<Patient[]> {
  await requireZorgverlener();

  return prisma.patient.findMany({
    orderBy: { aangemaakt: 'desc' },
    take: limit,
  });
}
