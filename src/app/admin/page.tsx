import Link from 'next/link'
import { getSession } from '@/shared/lib/auth'
import { prisma } from '@/shared/lib/prisma'
import { startVanDag, eindVanDag, startVanWeek, formatTijdNL } from '@/shared/utils/dateHelpers'

export default async function AdminDashboard() {
  const session = await getSession()

  // Fetch user name
  let greeting = 'Welkom'
  if (session) {
    const user = await prisma.teamlid.findUnique({
      where: { id: session.userId },
      select: { voornaam: true },
    })
    if (user) greeting = `Welkom, ${user.voornaam}`
  }

  // Fetch dashboard stats
  const now = new Date()
  const dagStart = startVanDag(now)
  const dagEind = eindVanDag(now)
  const weekStart = startVanWeek(now)
  const weekEind = new Date(weekStart)
  weekEind.setDate(weekEind.getDate() + 7)

  const [
    afsprakenVandaag,
    afsprakenWeek,
    onbevestigd,
    patientCount,
    teamCount,
  ] = await Promise.all([
    prisma.afspraak.count({
      where: { datum: { gte: dagStart, lt: dagEind } },
    }),
    prisma.afspraak.count({
      where: { datum: { gte: weekStart, lt: weekEind } },
    }),
    prisma.afspraak.count({
      where: { status: 'TE_BEVESTIGEN' },
    }),
    prisma.patient.count(),
    prisma.teamlid.count({ where: { actief: true } }),
  ])

  // Fetch today's upcoming appointments
  const vandaagAfspraken = await prisma.afspraak.findMany({
    where: { datum: { gte: dagStart, lt: dagEind } },
    include: {
      patient: { select: { voornaam: true, achternaam: true } },
      zorgverlener: { select: { voornaam: true, achternaam: true } },
    },
    orderBy: { datum: 'asc' },
    take: 8,
  })

  const stats = [
    {
      label: 'Vandaag',
      value: afsprakenVandaag,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-blue-50 text-blue-600',
      href: '/admin/agenda',
    },
    {
      label: 'Deze week',
      value: afsprakenWeek,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
      color: 'bg-emerald-50 text-emerald-600',
      href: '/admin/agenda',
    },
    {
      label: 'Onbevestigd',
      value: onbevestigd,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      ),
      color: onbevestigd > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400',
      href: '/admin/agenda',
    },
    {
      label: 'Patiënten',
      value: patientCount,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
      color: 'bg-purple-50 text-purple-600',
      href: '/admin/patient',
    },
  ]

  const quickActions = [
    {
      label: 'Nieuwe afspraak',
      href: '/admin/afspraak/nieuw',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      ),
      variant: 'primary' as const,
    },
    {
      label: 'Nieuwe patiënt',
      href: '/admin/patient/nieuw',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
        </svg>
      ),
      variant: 'secondary' as const,
    },
    {
      label: 'Open agenda',
      href: '/admin/agenda',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
      variant: 'secondary' as const,
    },
  ]

  const STATUS_COLORS: Record<string, string> = {
    TE_BEVESTIGEN: 'bg-amber-100 text-amber-700',
    BEVESTIGD: 'bg-emerald-100 text-emerald-700',
    IN_WACHTZAAL: 'bg-blue-100 text-blue-700',
    BINNEN: 'bg-indigo-100 text-indigo-700',
    AFGEWERKT: 'bg-slate-100 text-slate-600',
    GEANNULEERD: 'bg-red-100 text-red-700',
    NO_SHOW: 'bg-orange-100 text-orange-700',
  }

  const STATUS_LABELS: Record<string, string> = {
    TE_BEVESTIGEN: 'Te bevestigen',
    BEVESTIGD: 'Bevestigd',
    IN_WACHTZAAL: 'Wachtzaal',
    BINNEN: 'Binnen',
    AFGEWERKT: 'Afgewerkt',
    GEANNULEERD: 'Geannuleerd',
    NO_SHOW: 'No-show',
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">{greeting}</h1>
          <p className="text-slate-500 mt-1">
            {now.toLocaleDateString('nl-BE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Appointments */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Afspraken vandaag</h2>
              <Link
                href="/admin/agenda"
                className="text-sm text-[var(--rb-primary)] font-medium hover:underline"
              >
                Bekijk agenda
              </Link>
            </div>

            {vandaagAfspraken.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 mx-auto mb-3 bg-slate-100 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <p className="text-slate-500 font-medium">Geen afspraken vandaag</p>
              </div>
            ) : (
              <div className="space-y-3">
                {vandaagAfspraken.map((afspraak) => (
                  <Link
                    key={afspraak.id}
                    href={`/admin/afspraak/${afspraak.id}/edit`}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="text-sm font-mono text-slate-500 w-12 text-right flex-shrink-0">
                      {formatTijdNL(new Date(afspraak.datum))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">
                        {afspraak.patient
                          ? `${afspraak.patient.voornaam} ${afspraak.patient.achternaam}`
                          : 'Geen patiënt'}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {afspraak.zorgverlener.voornaam} {afspraak.zorgverlener.achternaam}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-medium flex-shrink-0 ${STATUS_COLORS[afspraak.status] || 'bg-slate-100 text-slate-600'}`}>
                      {STATUS_LABELS[afspraak.status] || afspraak.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Snelle acties</h2>
              <div className="space-y-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className={`
                      flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200
                      ${action.variant === 'primary'
                        ? 'bg-[var(--rb-primary)] text-white hover:bg-[var(--rb-primary-dark)] shadow-lg shadow-[var(--rb-primary)]/20'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }
                    `}
                  >
                    {action.icon}
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Team Status */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Team</h2>
              <p className="text-sm text-slate-500 mb-4">{teamCount} actieve teamleden</p>
              <Link
                href="/admin/team"
                className="text-sm text-[var(--rb-primary)] font-medium hover:underline"
              >
                Beheer team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
