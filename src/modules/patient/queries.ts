'use server';

import { Patient, Afspraak } from '@prisma/client';
import { prisma } from '@/shared/lib/prisma';
import { requireZorgverlener } from '@/shared/lib/auth';

export type PatientWithLastAfspraak = Patient & {
  afspraken: Afspraak[];
  laatsteAfspraakDatum?: Date | null;
};

export async function getRecentPatients(limit: number = 50): Promise<Patient[]> {
  await requireZorgverlener();

  return prisma.patient.findMany({
    orderBy: { aangemaakt: 'desc' },
    take: limit,
  });
}

/**
 * Zoek patiënten op naam of RR
 * PRIVACY: RR wordt NOOIT gelogd in plaintext
 */
export async function searchPatients(
  query: string
): Promise<PatientWithLastAfspraak[]> {
  await requireZorgverlener();

  if (!query || query.trim().length < 2) {
    return [];
  }

  const searchTerm = query.trim();
  const rrClean = query.replace(/\D/g, '');

  // Build search conditions
  const whereConditions: any[] = [];

  // Search by name (voornaam OR achternaam) - SQLite doesn't support mode: 'insensitive'
  if (searchTerm) {
    whereConditions.push({
      OR: [
        { voornaam: { contains: searchTerm } },
        { achternaam: { contains: searchTerm } },
      ],
    });
  }

  // Search by RR (if input looks like RR digits)
  if (rrClean.length >= 3) {
    whereConditions.push({
      rijksregisternummer: { contains: rrClean },
    });
  }

  const patients = await prisma.patient.findMany({
    where: {
      OR: whereConditions,
    },
    include: {
      afspraken: {
        orderBy: { datum: 'desc' },
        take: 1,
      },
    },
    take: 20,
    orderBy: { aangemaakt: 'desc' },
  });

  // Add laatsteAfspraakDatum to each patient
  return patients.map((patient: any) => ({
    ...patient,
    laatsteAfspraakDatum:
      patient.afspraken.length > 0 ? patient.afspraken[0].datum : null,
  }));
}

/**
 * Haal een specifieke patiënt op via ID
 */
export async function getPatientById(
  patientId: number
): Promise<Patient | null> {
  await requireZorgverlener();

  return prisma.patient.findUnique({
    where: { id: patientId },
  });
}
