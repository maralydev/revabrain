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
    totalPatients,
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
    // Total patients count
    prisma.patient.count(),
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
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
              Welkom terug, {session.voornaam || "terug"}!
            </h1>
            <p className="text-gray-500 mt-1">
              {new Date().toLocaleDateString("nl-BE", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Praktijk open</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Afspraken vandaag"
          value={todayAppointments}
          icon={<CalendarIcon className="w-6 h-6" />}
          trend="vandaag"
          href="/admin/agenda"
          color="primary"
        />
        <StatCard
          title="Te bevestigen"
          value={unconfirmedAppointments}
          icon={<AlertIcon className="w-6 h-6" />}
          trend="actie nodig"
          trendType="warning"
          href="/admin/agenda"
          color="warning"
        />
        <StatCard
          title="Teamleden"
          value={teamMembers}
          icon={<TeamIcon className="w-6 h-6" />}
          trend="actief"
          href="/admin/team"
          color="info"
        />
        <StatCard
          title="Totaal patiënten"
          value={totalPatients}
          icon={<UsersIcon className="w-6 h-6" />}
          trend="geregistreerd"
          href="/admin/patient"
          color="success"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader
              title="Agenda vandaag"
              subtitle={`${todayAppointmentsList.length} afspraken gepland`}
              icon={<CalendarIcon className="w-5 h-5 text-[var(--rb-primary)]" />}
              action={
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/agenda">Bekijk agenda</Link>
                </Button>
              }
            />
            <CardContent>
              {todayAppointmentsList.length === 0 ? (
                <div className="text-center py-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <CalendarIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Geen afspraken voor vandaag</p>
                  <p className="text-sm text-gray-400 mt-1">Geniet van je vrije dag!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayAppointmentsList.map((appointment, index) => (
                    <Link
                      key={appointment.id}
                      href={`/admin/afspraak/${appointment.id}/edit`}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/80 hover:bg-[var(--rb-light)] border border-transparent hover:border-[var(--rb-primary)]/20 transition-all duration-200 group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex-shrink-0 w-16 text-center">
                        <div className="text-lg font-bold text-gray-900">
                          {appointment.datum.toLocaleTimeString("nl-BE", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                          {appointment.duur} min
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 group-hover:text-[var(--rb-primary)] transition-colors">
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
                        {getStatusLabel(appointment.status)}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader
              title="Snelle acties"
              icon={<LightningIcon className="w-5 h-5 text-[var(--rb-primary)]" />}
            />
            <CardContent>
              <div className="space-y-2.5">
                <Button 
                  fullWidth 
                  leftIcon={<PlusIcon className="w-4 h-4" />} 
                  asChild
                  className="justify-start"
                >
                  <Link href="/admin/afspraak/nieuw">Nieuwe afspraak</Link>
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<UserPlusIcon className="w-4 h-4" />}
                  asChild
                  className="justify-start"
                >
                  <Link href="/admin/patient/nieuw">Nieuwe patiënt</Link>
                </Button>
                <Button
                  variant="ghost"
                  fullWidth
                  leftIcon={<SearchIcon className="w-4 h-4" />}
                  asChild
                  className="justify-start"
                >
                  <Link href="/admin/patient">Patiënt zoeken</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Patients */}
          <Card>
            <CardHeader
              title="Recente patiënten"
              icon={<UsersIcon className="w-5 h-5 text-[var(--rb-primary)]" />}
              action={
                <Link 
                  href="/admin/patient" 
                  className="text-sm font-medium text-[var(--rb-primary)] hover:text-[var(--rb-primary-dark)] transition-colors"
                >
                  Alle patiënten
                </Link>
              }
            />
            <CardContent>
              <div className="space-y-3">
                {recentPatients.map((patient) => (
                  <Link
                    key={patient.id}
                    href={`/admin/patient/${patient.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--rb-primary)] to-[var(--rb-accent)] flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                      {patient.voornaam.charAt(0)}
                      {patient.achternaam.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate group-hover:text-[var(--rb-primary)] transition-colors">
                        {patient.voornaam} {patient.achternaam}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        {patient.rijksregisternummer}
                      </div>
                    </div>
                    <ArrowRightIcon className="w-4 h-4 text-gray-300 group-hover:text-[var(--rb-primary)] group-hover:translate-x-1 transition-all duration-200" />
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
  icon,
  trend,
  trendType = "neutral",
  href,
  color = "primary",
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend: string;
  trendType?: "positive" | "negative" | "warning" | "neutral";
  href: string;
  color?: "primary" | "success" | "warning" | "info" | "default";
}) {
  const colorStyles = {
    primary: {
      bg: "bg-[var(--rb-light)]",
      icon: "text-[var(--rb-primary)]",
      hover: "hover:border-[var(--rb-primary)]/30",
    },
    success: {
      bg: "bg-emerald-50",
      icon: "text-emerald-600",
      hover: "hover:border-emerald-200",
    },
    warning: {
      bg: "bg-amber-50",
      icon: "text-amber-600",
      hover: "hover:border-amber-200",
    },
    info: {
      bg: "bg-purple-50",
      icon: "text-purple-600",
      hover: "hover:border-purple-200",
    },
    default: {
      bg: "bg-gray-100",
      icon: "text-gray-600",
      hover: "hover:border-gray-200",
    },
  };

  const styles = colorStyles[color];

  return (
    <Link href={href} className="block group">
      <div className={cn(
        "bg-white rounded-xl p-5 border border-gray-100 shadow-[var(--shadow-card)]",
        "hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5",
        "transition-all duration-300",
        styles.hover
      )}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">{value}</p>
            <div className="mt-2">
              <span
                className={cn(
                  "inline-flex px-2.5 py-1 text-xs font-semibold rounded-lg",
                  trendType === "warning" && "bg-amber-100 text-amber-700",
                  trendType === "positive" && "bg-emerald-100 text-emerald-700",
                  trendType === "negative" && "bg-red-100 text-red-700",
                  trendType === "neutral" && "bg-gray-100 text-gray-600"
                )}
              >
                {trend}
              </span>
            </div>
          </div>
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", styles.bg)}>
            <span className={styles.icon}>{icon}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function getStatusVariant(status: string): "default" | "warning" | "primary" | "success" | "danger" | "info" | "outline" {
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

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    TE_BEVESTIGEN: "Te bevestigen",
    BEVESTIGD: "Bevestigd",
    IN_WACHTZAAL: "Wachtzaal",
    BINNEN: "Binnen",
    AFGEWERKT: "Afgewerkt",
    NO_SHOW: "No-show",
    GEANNULEERD: "Geannuleerd",
  };
  return labels[status] || status;
}

// Utility function for className merging
function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

// Icons
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function TeamIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
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

function LightningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
