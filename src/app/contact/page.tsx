import { PublicLayout } from "@/components/public/PublicLayout";
import { Card } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { prisma } from "@/shared/lib/prisma";

export default async function ContactPage() {
  const contactInfo = await prisma.contactInfo.findFirst();

  const openingHours = contactInfo?.openingstijden
    ? JSON.parse(contactInfo.openingstijden)
    : {};

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Contact
            </h1>
            <p className="text-lg text-gray-600">
              Heeft u vragen of wilt u een afspraak maken? Neem gerust contact
              met ons op.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <PhoneIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Telefoon
                </h3>
                <p className="text-gray-600 mb-3">
                  Bereikbaar tijdens kantooruren
                </p>
                <a
                  href={`tel:${contactInfo?.telefoon || ""}`}
                  className="text-blue-600 font-medium hover:text-blue-700"
                >
                  {contactInfo?.telefoon || "+32 (0)0 000 00 00"}
                </a>
              </Card>

              <Card className="p-6">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                  <EmailIcon className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  E-mail
                </h3>
                <p className="text-gray-600 mb-3">
                  We reageren binnen 24 uur
                </p>
                <a
                  href={`mailto:${contactInfo?.email || ""}`}
                  className="text-blue-600 font-medium hover:text-blue-700"
                >
                  {contactInfo?.email || "info@revabrain.be"}
                </a>
              </Card>

              <Card className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <LocationIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Adres
                </h3>
                <address className="text-gray-600 not-italic">
                  {contactInfo?.adresStraat || "Straatnaam"}{" "}
                  {contactInfo?.adresNummer || "123"}
                  <br />
                  {contactInfo?.adresPostcode || "1000"}{" "}
                  {contactInfo?.adresGemeente || "Brussel"}
                  <br />
                  België
                </address>
              </Card>
            </div>

            {/* Opening Hours & Map */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Openingstijden
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { day: "Maandag", key: "monday" },
                    { day: "Dinsdag", key: "tuesday" },
                    { day: "Woensdag", key: "wednesday" },
                    { day: "Donderdag", key: "thursday" },
                    { day: "Vrijdag", key: "friday" },
                    { day: "Zaterdag", key: "saturday" },
                    { day: "Zondag", key: "sunday" },
                  ].map(({ day, key }) => (
                    <div
                      key={key}
                      className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                    >
                      <span className="font-medium text-gray-700">{day}</span>
                      <span className="text-gray-600">
                        {openingHours[key] || "Gesloten"}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Locatie
                </h2>
                <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                  {/* Placeholder for map */}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50">
                    <div className="text-center">
                      <LocationIcon className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                      <p className="text-gray-600">
                        Kaart wordt geladen...
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {contactInfo?.adresGemeente || "Brussel"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Button asChild>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(
                        `${contactInfo?.adresStraat || ""} ${
                          contactInfo?.adresNummer || ""
                        }, ${contactInfo?.adresPostcode || ""} ${
                          contactInfo?.adresGemeente || ""
                        }`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open in Google Maps
                    </a>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

// Icons
function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}
