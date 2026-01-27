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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[var(--rb-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Contact Instellingen
            </h1>
            <p className="text-slate-500 mt-1">
              Beheer contactgegevens en openingstijden
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="px-5 py-2.5 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Terug
          </button>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-medium">{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Details */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4 text-[var(--rb-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Contactgegevens
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Telefoon <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={telefoon}
                    onChange={(e) => setTelefoon(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4 text-[var(--rb-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Adres
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Straat <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={straat}
                    onChange={(e) => setStraat(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nr <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={nummer}
                    onChange={(e) => setNummer(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Postcode <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Gemeente <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={gemeente}
                    onChange={(e) => setGemeente(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Latitude <span className="text-slate-400 font-normal">(voor kaart)</span>
                  </label>
                  <input
                    type="text"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="50.8503"
                    className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Longitude <span className="text-slate-400 font-normal">(voor kaart)</span>
                  </label>
                  <input
                    type="text"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="4.3517"
                    className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4 text-[var(--rb-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Openingstijden
              </h2>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {DAGEN.map((dag) => (
                  <div key={dag} className="flex items-center gap-4">
                    <label className="w-28 text-sm font-semibold text-slate-700">
                      {DAG_LABELS[dag]}
                    </label>
                    <input
                      type="text"
                      value={openingstijden[dag] || ''}
                      onChange={(e) => handleOpeningstijdChange(dag, e.target.value)}
                      placeholder="09:00-17:00 of Gesloten"
                      className="flex-1 px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-500 mt-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Formaat: &ldquo;09:00-17:00&rdquo; of &ldquo;Gesloten&rdquo;
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="
                py-4 px-8
                bg-gradient-to-r from-[var(--rb-primary)] to-[var(--rb-primary-dark)]
                text-white font-semibold rounded-xl
                shadow-lg shadow-[var(--rb-primary)]/25
                hover:shadow-xl hover:shadow-[var(--rb-primary)]/30
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
                flex items-center gap-2
              "
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Opslaan...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Wijzigingen Opslaan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
