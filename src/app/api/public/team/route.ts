import { NextResponse } from 'next/server';
import { getPublicTeamleden } from '@/modules/teamlid/queries';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const teamleden = await getPublicTeamleden();
    return NextResponse.json(teamleden);
  } catch (error) {
    console.error('Error fetching public team:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}
