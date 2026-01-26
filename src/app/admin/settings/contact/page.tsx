'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getContactInfo, updateContactInfo } from '@/modules/contact-config/actions';

const DAGEN = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];
const DAG_LABELS: Record<string, string> = {
  ma: 'Maandag',
  di: 'Dinsdag',
  wo: 'Woensdag',
  do: 'Donderdag',
  vr: 'Vrijdag',
  za: 'Zaterdag',
  zo: 'Zondag',
};

export default function ContactSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Contact info
  const [telefoon, setTelefoon] = useState('+32 2 123 45 67');
  const [email, setEmail] = useState('info@revabrain.be');
  const [straat, setStraat] = useState('Voorbeeldstraat');
  const [nummer, setNummer] = useState('1');
  const [postcode, setPostcode] = useState('1000');
  const [gemeente, setGemeente] = useState('Brussel');
  const [latitude, setLatitude] = useState('50.8503');
  const [longitude, setLongitude] = useState('4.3517');

  // Opening hours
  const [openingstijden, setOpeningstijden] = useState<Record<string, string>>({
    ma: '09:00-17:00',
    di: '09:00-17:00',
    wo: '09:00-17:00',
    do: '09:00-17:00',
    vr: '09:00-16:00',
    za: 'Gesloten',
    zo: 'Gesloten',
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const info = await getContactInfo();
      if (info) {
        setTelefoon(info.telefoon);
        setEmail(info.email);
        setStraat(info.adresStraat);
        setNummer(info.adresNummer);
        setPostcode(info.adresPostcode);
        setGemeente(info.adresGemeente);
        if (info.latitude) setLatitude(info.latitude.toString());
        if (info.longitude) setLongitude(info.longitude.toString());
        if (info.openingstijden) {
          try {
            const parsed = JSON.parse(info.openingstijden);
            setOpeningstijden(parsed);
          } catch (e) {
            console.error('Error parsing openingstijden:', e);
          }
        }
      }
    } catch (err) {
      console.error('Error loading contact info:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const result = await updateContactInfo({
        telefoon,
        email,
        adresStraat: straat,
        adresNummer: nummer,
        adresPostcode: postcode,
        adresGemeente: gemeente,
        latitude: parseFloat(latitude) || undefined,
        longitude: parseFloat(longitude) || undefined,
        openingstijden,
      });

      if (result.success) {
        setSuccess('Wijzigingen opgeslagen!');
      } else {
        setError(result.error || 'Fout bij opslaan');
      }
    } catch (err) {
      setError('Er is een fout opgetreden');
    } finally {
      setSaving(false);
    }
  }

  function handleOpeningstijdChange(dag: string, value: string) {
    setOpeningstijden((prev) => ({
      ...prev,
      [dag]: value,
    }));
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-gray-600">Laden...</p>
      </div>
    );
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Details */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Contactgegevens
          </h2>

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

        {/* Address */}
        <div className="bg-white p-6 rounded-lg shadow">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude (voor kaart)
                </label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="50.8503"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude (voor kaart)
                </label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="4.3517"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Openingstijden
          </h2>

          <div className="space-y-3">
            {DAGEN.map((dag) => (
              <div key={dag} className="flex items-center gap-4">
                <label className="w-28 text-sm font-medium text-gray-700">
                  {DAG_LABELS[dag]}
                </label>
                <input
                  type="text"
                  value={openingstijden[dag] || ''}
                  onChange={(e) => handleOpeningstijdChange(dag, e.target.value)}
                  placeholder="09:00-17:00 of Gesloten"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Formaat: "09:00-17:00" of "Gesloten"
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-[#2879D8] text-white rounded-md hover:bg-[#1e60b0] disabled:opacity-50"
          >
            {saving ? 'Opslaan...' : 'Wijzigingen Opslaan'}
          </button>
        </div>
      </form>
    </div>
  );
}
