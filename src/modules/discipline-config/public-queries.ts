'use server';

import { prisma } from '@/shared/lib/prisma';

export interface PublicDisciplineData {
  code: string;
  naam: string;
  beschrijving: string | null;
}

export interface PublicTeamlidData {
  id: number;
  voornaam: string;
  achternaam: string;
  bio: string | null;
  foto: string | null;
}

export interface DisciplineDetailResult {
  discipline: PublicDisciplineData | null;
  teamleden: PublicTeamlidData[];
}

/**
 * Haal discipline details op voor publieke site (geen auth vereist)
 */
export async function getDisciplineDetail(
  code: string
): Promise<DisciplineDetailResult> {
  try {
    // Find discipline config
    const discipline = await prisma.disciplineConfig.findFirst({
      where: { code: code.toUpperCase(), actief: true },
    });

    if (!discipline) {
      return { discipline: null, teamleden: [] };
    }

    // Find team members - use raw query to avoid enum type issue
    const teamleden = await prisma.$queryRaw<PublicTeamlidData[]>`
      SELECT id, voornaam, achternaam, bio, foto
      FROM Teamlid
      WHERE discipline = ${code.toUpperCase()} AND actief = 1
    `;

    return {
      discipline: {
        code: discipline.code,
        naam: discipline.naam,
        beschrijving: discipline.beschrijving,
      },
      teamleden: teamleden || [],
    };
  } catch (error) {
    console.error('Error fetching discipline detail:', error);
    return { discipline: null, teamleden: [] };
  }
}
