import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const behandelingen = await prisma.behandeling.findMany({
      where: { actief: true },
      include: {
        aandoeningen: {
          orderBy: { volgorde: 'asc' },
        },
      },
      orderBy: { volgorde: 'asc' },
    });

    return NextResponse.json(behandelingen);
  } catch (error) {
    console.error('Error fetching behandelingen:', error);
    return NextResponse.json(
      { error: 'Failed to fetch behandelingen' },
      { status: 500 }
    );
  }
}
