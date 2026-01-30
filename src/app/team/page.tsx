import { PublicLayout } from "@/components/public/PublicLayout";
import { Card } from "@/shared/components/ui/Card";
import { prisma } from "@/shared/lib/prisma";
import Image from "next/image";

export default async function TeamPage() {
  const teamMembers = await prisma.teamlid.findMany({
    where: {
      actief: true,
    },
    select: {
      id: true,
      voornaam: true,
      achternaam: true,
      bio: true,
      foto: true,
      discipline: true,
    },
    orderBy: {
      achternaam: "asc",
    },
  });

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Ons team
            </h1>
            <p className="text-lg text-gray-600">
              Ontmoet onze gespecialiseerde zorgverleners die dagelijks werken
              aan het herstel van onze patienten.
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.id} hover className="overflow-hidden">
                <div className="aspect-square relative bg-gray-100">
                  {member.foto ? (
                    <Image
                      src={member.foto}
                      alt={`${member.voornaam} ${member.achternaam}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-teal-100">
                      <span className="text-5xl font-bold text-blue-600">
                        {member.voornaam.charAt(0)}
                        {member.achternaam.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {member.voornaam} {member.achternaam}
                  </h3>
                  {member.discipline && (
                    <p className="text-blue-600 font-medium mt-1">
                      {member.discipline}
                    </p>
                  )}
                  {member.bio && (
                    <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {teamMembers.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p>Geen teamleden gevonden.</p>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
