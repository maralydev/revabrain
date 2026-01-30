import { PublicLayout } from "@/components/public/PublicLayout";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/shared/components/ui/Button";
import { Card } from "@/shared/components/ui/Card";

export default function HomePage() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-teal-50" />
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230f4c81' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                Neurologische revalidatiepraktijk
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                Samen werken we aan{" "}
                <span className="text-blue-600">uw herstel</span>
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                RevaBrain is een multidisciplinaire groepspraktijk gespecialiseerd
                in neurologische revalidatie. Wij begeleiden volwassenen met
                niet-aangeboren hersenletsel en kinderen met taal- en
                leerproblemen.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/contact">Maak een afspraak</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/disciplines">Onze disciplines</Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">5+</div>
                    <div className="text-sm text-gray-500 mt-1">Disciplines</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">100%</div>
                    <div className="text-sm text-gray-500 mt-1">Persoonlijk</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">2019</div>
                    <div className="text-sm text-gray-500 mt-1">Opgericht</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative lg:h-[600px]">
              <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/profiel-imene.jpeg"
                  alt="Imene Chetti - Neurologopedist en oprichter RevaBrain"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-teal-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Erkende zorgverlener
                    </div>
                    <div className="text-sm text-gray-500">
                      Erkend door RIZIV
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disciplines Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Onze disciplines
            </h2>
            <p className="text-lg text-gray-600">
              Een multidisciplinaire aanpak voor optimale zorg. Onze
              gespecialiseerde zorgverleners werken samen aan uw herstel.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {disciplines.map((discipline) => (
              <Card
                key={discipline.name}
                hover
                className="p-6 group cursor-pointer"
              >
                <div
                  className={`w-14 h-14 ${discipline.bgColor} rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}
                >
                  <discipline.icon
                    className={`w-7 h-7 ${discipline.iconColor}`}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {discipline.name}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {discipline.description}
                </p>
                <Link
                  href={discipline.href}
                  className="inline-flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all"
                >
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
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-500" />
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />

            <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Start vandaag nog met uw herstel
              </h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                Neem contact met ons op voor een intakegesprek. Samen bekijken
                we hoe we u het best kunnen helpen.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  asChild
                >
                  <Link href="/contact">Contacteer ons</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/verwijzers">Voor verwijzers</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

// Discipline icons as components
function LogopedieIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
      />
    </svg>
  );
}

function KinesitherapieIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  );
}

function ErgotherapieIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  );
}

function NeuropsychologieIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function DietiekIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );
}

const disciplines = [
  {
    name: "Logopedie",
    description:
      "Diagnostiek en behandeling van spraak-, taal-, en slikstoornissen bij volwassenen en kinderen.",
    href: "/disciplines/logopedie",
    icon: LogopedieIcon,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    name: "Kinesitherapie",
    description:
      "Motorische revalidatie en herstel van bewegingsfuncties na neurologische aandoeningen.",
    href: "/disciplines/kinesitherapie",
    icon: KinesitherapieIcon,
    bgColor: "bg-teal-100",
    iconColor: "text-teal-600",
  },
  {
    name: "Ergotherapie",
    description:
      "Het herwinnen van dagelijkse vaardigheden en het optimaliseren van participatie.",
    href: "/disciplines/ergotherapie",
    icon: ErgotherapieIcon,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    name: "Neuropsychologie",
    description:
      "Onderzoek en behandeling van cognitieve functies zoals geheugen, aandacht en executief functioneren.",
    href: "/disciplines/neuropsychologie",
    icon: NeuropsychologieIcon,
    bgColor: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    name: "Diëtiek",
    description:
      "Voedingsadvies op maat voor optimaal herstel en welzijn.",
    href: "/disciplines/dietiek",
    icon: DietiekIcon,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
];
