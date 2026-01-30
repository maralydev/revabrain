import { PublicLayout } from "@/components/public/PublicLayout";
import { Card } from "@/shared/components/ui/Card";
import { prisma } from "@/shared/lib/prisma";
import Link from "next/link";

export default async function DisciplinesPage() {
  const disciplines = await prisma.disciplineConfig.findMany({
    where: {
      actief: true,
    },
    orderBy: {
      volgorde: "asc",
    },
  });

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Onze disciplines
            </h1>
            <p className="text-lg text-gray-600">
              Een multidisciplinaire aanpak voor optimale zorg. Elke discipline
              brengt zijn eigen expertise in voor een complete behandeling.
            </p>
          </div>
        </div>
      </section>

      {/* Disciplines Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {disciplines.map((discipline) => (
              <Link
                key={discipline.code}
                href={`/disciplines/${discipline.code.toLowerCase()}`}
              >
                <Card hover className="h-full p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <DisciplineIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        {discipline.naam}
                      </h2>
                      {discipline.beschrijving ? (
                        <p className="text-gray-600 leading-relaxed">
                          {discipline.beschrijving}
                        </p>
                      ) : (
                        <p className="text-gray-500 italic">
                          Klik voor meer informatie
                        </p>
                      )}
                      <div className="mt-4 inline-flex items-center gap-2 text-blue-600 font-medium">
                        Meer informatie
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {disciplines.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p>Geen disciplines gevonden.</p>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}

function DisciplineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
      />
    </svg>
  );
}
