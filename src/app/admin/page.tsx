import { prisma } from "@/shared/lib/prisma";
import { requireAuth } from "@/shared/lib/auth";
import { Card, CardHeader, CardContent } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await requireAuth();
  const userId = session.userId as number;

  // Get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Fetch dashboard data
  const [
    todayAppointments,
    unconfirmedAppointments,
    teamMembers,
    recentPatients,
  ] = await Promise.all([
    // Today's appointments
    prisma.afspraak.count({
      where: {
        zorgverlenerId: userId,
        datum: {
          gte: today,
          lt: tomorrow,
        },
        status: {
          not: "GEANNULEERD",
        },
      },
    }),
    // Unconfirmed appointments
    prisma.afspraak.count({
      where: {
        zorgverlenerId: userId,
        status: "TE_BEVESTIGEN",
        datum: {
          gte: today,
        },
      },
    }),
    // Team members
    prisma.teamlid.count({
      where: {
        actief: true,
      },
    }),
    // Recent patients
    prisma.patient.findMany({
      take: 5,
      orderBy: {
        laatstGewijzigd: "desc",
      },
      select: {
        id: true,
        voornaam: true,
        achternaam: true,
        rijksregisternummer: true,
      },
    }),
  ]);

  // Get upcoming appointments for today
  const todayAppointmentsList = await prisma.afspraak.findMany({
    where: {
      zorgverlenerId: userId,
      datum: {
        gte: today,
        lt: tomorrow,
      },
      status: {
        not: "GEANNULEERD",
      },
    },
    include: {
      patient: {
        select: {
          voornaam: true,
          achternaam: true,
        },
      },
    },
    orderBy: {
      datum: "asc",
    },
    take: 5,
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welkom terug, {session.voornaam || "terug"}. Hier is een overzicht van uw praktijk.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Afspraken vandaag"
          value={todayAppointments}
          icon={CalendarIcon}
          trend="vandaag"
          href="/admin/agenda"
        />
        <StatCard
          title="Te bevestigen"
          value={unconfirmedAppointments}
          icon={AlertIcon}
          trend="actie nodig"
          trendType="warning"
          href="/admin/agenda"
        />
        <StatCard
          title="Teamleden"
          value={teamMembers}
          icon={TeamIcon}
          trend="actief"
          href="/admin/team"
        />
        <StatCard
          title="Patienten"
          value={recentPatients.length}
          icon={UsersIcon}
          trend="recent"
          href="/admin/patient"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Agenda vandaag"
              subtitle={new Date().toLocaleDateString("nl-BE", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              action={
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/agenda">Bekijk agenda</Link>
                </Button>
              }
            />
            <CardContent>
              {todayAppointmentsList.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Geen afspraken voor vandaag</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayAppointmentsList.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-shrink-0 w-16 text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {appointment.datum.toLocaleTimeString("nl-BE", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {appointment.duur} min
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900">
                          {appointment.patient
                            ? `${appointment.patient.voornaam} ${appointment.patient.achternaam}`
                            : appointment.adminTitel || "Geen titel"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.type}
                        </div>
                      </div>
                      <Badge
                        variant={getStatusVariant(appointment.status)}
                        size="sm"
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader title="Snelle acties" />
            <CardContent>
              <div className="space-y-3">
                <Button fullWidth leftIcon={<PlusIcon className="w-4 h-4" />} asChild>
                  <Link href="/admin/afspraak/nieuw">Nieuwe afspraak</Link>
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<UserPlusIcon className="w-4 h-4" />}
                  asChild
                >
                  <Link href="/admin/patient/nieuw">Nieuwe patient</Link>
                </Button>
                <Button
                  variant="ghost"
                  fullWidth
                  leftIcon={<SearchIcon className="w-4 h-4" />}
                  asChild
                >
                  <Link href="/admin/patient">Patient zoeken</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader title="Recente patienten" />
            <CardContent>
              <div className="space-y-3">
                {recentPatients.map((patient) => (
                  <Link
                    key={patient.id}
                    href={`/admin/patient/${patient.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                      {patient.voornaam.charAt(0)}
                      {patient.achternaam.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {patient.voornaam} {patient.achternaam}
                      </div>
                      <div className="text-xs text-gray-500">
                        {patient.rijksregisternummer}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Components
function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendType = "neutral",
  href,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  trend: string;
  trendType?: "positive" | "negative" | "warning" | "neutral";
  href: string;
}) {
  const trendColors = {
    positive: "text-green-600 bg-green-50",
    negative: "text-red-600 bg-red-50",
    warning: "text-amber-600 bg-amber-50",
    neutral: "text-gray-600 bg-gray-100",
  };

  return (
    <Link href={href} className="block">
      <Card hover className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="mt-4">
          <span
            className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${trendColors[trendType]}`}
          >
            {trend}
          </span>
        </div>
      </Card>
    </Link>
  );
}

function getStatusVariant(status: string) {
  switch (status) {
    case "TE_BEVESTIGEN":
      return "warning";
    case "BEVESTIGD":
      return "primary";
    case "IN_WACHTZAAL":
      return "info";
    case "BINNEN":
      return "success";
    case "AFGEWERKT":
      return "default";
    case "NO_SHOW":
      return "danger";
    case "GEANNULEERD":
      return "outline";
    default:
      return "default";
  }
}

// Icons
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function TeamIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function UserPlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}
