'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold" style={{ color: '#2879D8' }}>
            RevaBrain
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="text-gray-900 font-medium" style={{ color: '#2879D8' }}>
              Home
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Inloggen
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6" style={{ color: '#2879D8' }}>
            RevaBrain
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            Neurologische Revalidatiepraktijk
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            Gespecialiseerde zorg voor volwassenen met NAH (Niet-aangeboren hersenletsel)
            en kinderen met taal- en leerproblemen
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3 text-white rounded-md hover:opacity-90 text-lg"
              style={{ backgroundColor: '#2879D8' }}
            >
              Neem Contact Op
            </Link>
            <a
              href="tel:+3221234567"
              className="px-8 py-3 border-2 rounded-md hover:bg-gray-50 text-lg"
              style={{ borderColor: '#2879D8', color: '#2879D8' }}
            >
              Bel Direct: +32 2 123 45 67
            </a>
          </div>
        </div>
      </section>

      {/* Disciplines Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#2879D8' }}>
            Onze Disciplines
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3" style={{ color: '#2879D8' }}>
                Logopedie
              </h3>
              <p className="text-gray-600">
                Behandeling van spraak-, taal- en slikstoornissen bij volwassenen en kinderen
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3" style={{ color: '#2879D8' }}>
                Kinesitherapie
              </h3>
              <p className="text-gray-600">
                Bewegingstherapie gericht op herstel van fysieke functies
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3" style={{ color: '#2879D8' }}>
                Ergotherapie
              </h3>
              <p className="text-gray-600">
                Ondersteuning bij dagelijkse activiteiten en zelfstandigheid
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3" style={{ color: '#2879D8' }}>
                Neuropsychologie
              </h3>
              <p className="text-gray-600">
                Onderzoek en behandeling van cognitieve functies
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-3" style={{ color: '#2879D8' }}>
                Diëtiek
              </h3>
              <p className="text-gray-600">
                Voedingsadvies en begeleiding
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6" style={{ color: '#2879D8' }}>
            Over RevaBrain
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            RevaBrain is een multidisciplinaire neurologische revalidatiepraktijk
            gespecialiseerd in de behandeling van volwassenen met niet-aangeboren
            hersenletsel (NAH) en kinderen met taal- en leerproblemen.
          </p>
          <p className="text-lg text-gray-600">
            Ons team van gespecialiseerde zorgverleners biedt persoonlijke begeleiding
            en evidence-based behandelingen in een professionele en warme omgeving.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">RevaBrain</h3>
              <p className="text-gray-400">
                Neurologische revalidatiepraktijk voor volwassenen en kinderen
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">
                Tel: +32 2 123 45 67<br />
                Email: info@revabrain.be
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Navigatie</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-gray-400 hover:text-white">
                    Inloggen (Team)
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-400 border-t border-gray-800 pt-8">
            &copy; {new Date().getFullYear()} RevaBrain. Alle rechten voorbehouden.
          </div>
        </div>
      </footer>
    </div>
  );
}
