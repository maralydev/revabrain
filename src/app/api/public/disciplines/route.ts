import { NextResponse } from 'next/server';
import { getActieveDisciplineConfigs } from '@/modules/discipline-config/queries';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const disciplines = await getActieveDisciplineConfigs();
    return NextResponse.json(disciplines);
  } catch (error) {
    console.error('Error fetching public disciplines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch disciplines' },
      { status: 500 }
    );
  }
}
