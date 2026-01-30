import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/shared/lib/auth'
import { prisma } from '@/shared/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get search query
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
      return NextResponse.json([])
    }

    const searchLower = query.toLowerCase()
    const nameParts = searchLower.split(' ')

    // Search patients by name
    const patients = await prisma.patient.findMany({
      where: {
        OR: [
          {
            voornaam: {
              contains: searchLower,
            },
          },
          {
            achternaam: {
              contains: searchLower,
            },
          },
          // Search by full name (voornaam + achternaam)
          ...(nameParts.length > 1
            ? [
                {
                  AND: [
                    { voornaam: { contains: nameParts[0] } },
                    { achternaam: { contains: nameParts.slice(1).join(' ') } },
                  ],
                },
              ]
            : []),
        ],
      },
      select: {
        id: true,
        voornaam: true,
        achternaam: true,
        geboortedatum: true,
      },
      take: 10,
      orderBy: [
        { achternaam: 'asc' },
        { voornaam: 'asc' },
      ],
    })

    return NextResponse.json(patients)
  } catch (error) {
    console.error('Patient search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
