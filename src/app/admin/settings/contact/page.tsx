'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ContactSettingsPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // Hardcoded for now - in future, fetch from API
  const [telefoon, setTelefoon] = useState('+32 2 123 45 67');
  const [email, setEmail] = useState('info@revabrain.be');
  const [straat, setStraat] = useState('Voorbeeldstraat');
  const [nummer, setNummer] = useState('1');
  const [postcode, setPostcode] = useState('1000');
  const [gemeente, setGemeente] = useState('Brussel');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    // Simulate save
    setTimeout(() => {
      setSuccess('Wijzigingen opgeslagen (demo)');
      setSaving(false);
    }, 500);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#2879D8' }}>
          Contact Instellingen
        </h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Terug
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-6">
        <p className="text-sm">
          <strong>Let op:</strong> Deze pagina is een demo. Wijzigingen worden nog niet opgeslagen in de database.
          Voor volledige functionaliteit: implementeer server action met ContactInfo table update.
        </p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Contactgegevens
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefoon *
                </label>
                <input
                  type="tel"
                  value={telefoon}
                  onChange={(e) => setTelefoon(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Adres
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Straat *
                </label>
                <input
                  type="text"
                  value={straat}
                  onChange={(e) => setStraat(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nummer *
                </label>
                <input
                  type="text"
                  value={nummer}
                  onChange={(e) => setNummer(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postcode *
                </label>
                <input
                  type="text"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gemeente *
                </label>
                <input
                  type="text"
                  value={gemeente}
                  onChange={(e) => setGemeente(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <button
            type="submit"
            disabled={saving}
            className="w-full py-2 px-4 bg-[#2879D8] text-white rounded-md hover:bg-[#1e60b0] disabled:opacity-50"
          >
            {saving ? 'Opslaan...' : 'Wijzigingen Opslaan'}
          </button>
        </div>
      </form>

      <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">Implementatie Notities</h3>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>ContactInfo table bestaat al in database</li>
          <li>Nog te implementeren: server action om ContactInfo bij te werken</li>
          <li>Nog te implementeren: openingstijden editor (JSON)</li>
          <li>Nog te implementeren: latitude/longitude voor kaart</li>
          <li>Future: Real-time preview van contact pagina</li>
        </ul>
      </div>
    </div>
  );
}
