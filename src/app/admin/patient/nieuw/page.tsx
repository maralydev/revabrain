'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { registerPatient } from '@/modules/patient/actions';
import {
  valideerRijksregisternummer,
  geboortedatumUitRR,
  geslachtUitRR,
  formatteerRR,
} from '@/shared/utils/rijksregisternummer';

export default function NieuwePatientPage() {
  const router = useRouter();

  const [rr, setRR] = useState('');
  const [voornaam, setVoornaam] = useState('');
  const [achternaam, setAchternaam] = useState('');
  const [telefoonnummer, setTelefoonnummer] = useState('');
  const [email, setEmail] = useState('');
  const [straat, setStraat] = useState('');
  const [huisnummer, setHuisnummer] = useState('');
  const [postcode, setPostcode] = useState('');
  const [gemeente, setGemeente] = useState('');
  const [contactpersoon, setContactpersoon] = useState('');
  const [contactpersoonTelefoon, setContactpersoonTelefoon] = useState('');

  const [rrValide, setRRValide] = useState(false);
  const [afgeleideData, setAfgeleideData] = useState<{
    geboortedatum: Date | null;
    geslacht: 'M' | 'V' | null;
  } | null>(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Valideer RR en leid data af bij wijziging
  useEffect(() => {
    const rrSchoon = rr.replace(/\D/g, '');

    if (rrSchoon.length === 11) {
      const valide = valideerRijksregisternummer(rrSchoon);
      setRRValide(valide);

      if (valide) {
        const geboortedatum = geboortedatumUitRR(rrSchoon);
        const geslacht = geslachtUitRR(rrSchoon);
        setAfgeleideData({ geboortedatum, geslacht });
      } else {
        setAfgeleideData(null);
      }
    } else {
      setRRValide(false);
      setAfgeleideData(null);
    }
  }, [rr]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await registerPatient({
        rijksregisternummer: rr,
        voornaam,
        achternaam,
        telefoonnummer,
        email: email || undefined,
        straat: straat || undefined,
        huisnummer: huisnummer || undefined,
        postcode: postcode || undefined,
        gemeente: gemeente || undefined,
        contactpersoon: contactpersoon || undefined,
        contactpersoonTelefoon: contactpersoonTelefoon || undefined,
      });

      if (result.success) {
        router.push('/admin/patient');
        router.refresh();
      } else {
        setError(result.error || 'Registratie mislukt');
      }
    } catch (err) {
      setError('Er is een fout opgetreden');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Nieuwe Patiënt
          </h1>
          <p className="text-slate-500 mt-1">
            Registreer een nieuwe patiënt via rijksregisternummer
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Rijksregisternummer Section */}
          <div className="p-6 border-b border-slate-100">
            <label htmlFor="rr" className="block text-sm font-semibold text-slate-700 mb-2">
              Rijksregisternummer <span className="text-red-400">*</span>
            </label>
            <input
              id="rr"
              type="text"
              required
              value={rr}
              onChange={(e) => setRR(e.target.value)}
              placeholder="00.00.00-000.00"
              className={`
                w-full px-4 py-3.5 bg-slate-50 border-0 rounded-xl
                focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white
                transition-all duration-200 text-slate-800 placeholder:text-slate-400
                ${rr && !rrValide && rr.replace(/\D/g, '').length === 11 ? 'ring-2 ring-red-400' : ''}
              `}
            />
            {rr && !rrValide && rr.replace(/\D/g, '').length === 11 && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ongeldig rijksregisternummer (checksum fout)
              </p>
            )}
            {rrValide && afgeleideData && (
              <div className="mt-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-700">
                    Valide rijksregisternummer
                  </p>
                  <p className="text-sm text-emerald-600">
                    Geboren op {afgeleideData.geboortedatum?.toLocaleDateString('nl-BE')} • {afgeleideData.geslacht === 'M' ? 'Man' : 'Vrouw'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Personal Info Section */}
          <div className="p-6 border-b border-slate-100 space-y-5">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Persoonsgegevens</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="voornaam" className="block text-sm font-semibold text-slate-700 mb-2">
                  Voornaam <span className="text-red-400">*</span>
                </label>
                <input
                  id="voornaam"
                  type="text"
                  required
                  value={voornaam}
                  onChange={(e) => setVoornaam(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                  placeholder="Jan"
                />
              </div>
              <div>
                <label htmlFor="achternaam" className="block text-sm font-semibold text-slate-700 mb-2">
                  Achternaam <span className="text-red-400">*</span>
                </label>
                <input
                  id="achternaam"
                  type="text"
                  required
                  value={achternaam}
                  onChange={(e) => setAchternaam(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                  placeholder="Jansen"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="telefoonnummer" className="block text-sm font-semibold text-slate-700 mb-2">
                  Telefoonnummer <span className="text-red-400">*</span>
                </label>
                <input
                  id="telefoonnummer"
                  type="tel"
                  required
                  value={telefoonnummer}
                  onChange={(e) => setTelefoonnummer(e.target.value)}
                  placeholder="+32 123 45 67 89"
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email <span className="text-slate-400 font-normal">(optioneel)</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jan.jansen@email.be"
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="p-6 border-b border-slate-100 space-y-5">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
              Adres <span className="text-slate-400 font-normal normal-case">(optioneel)</span>
            </h3>

            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3">
                <input
                  type="text"
                  value={straat}
                  onChange={(e) => setStraat(e.target.value)}
                  placeholder="Straat"
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={huisnummer}
                  onChange={(e) => setHuisnummer(e.target.value)}
                  placeholder="Nr"
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <input
                  type="text"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  placeholder="Postcode"
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                />
              </div>
              <div className="col-span-3">
                <input
                  type="text"
                  value={gemeente}
                  onChange={(e) => setGemeente(e.target.value)}
                  placeholder="Gemeente"
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Contact Person Section */}
          <div className="p-6 border-b border-slate-100 space-y-5">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
              Contactpersoon <span className="text-slate-400 font-normal normal-case">(voor kinderen/wilsonbekwamen)</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  value={contactpersoon}
                  onChange={(e) => setContactpersoon(e.target.value)}
                  placeholder="Naam contactpersoon"
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                />
              </div>
              <div>
                <input
                  type="tel"
                  value={contactpersoonTelefoon}
                  onChange={(e) => setContactpersoonTelefoon(e.target.value)}
                  placeholder="Telefoonnummer"
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-6 mt-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-100">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="p-6 flex gap-3">
            <button
              type="submit"
              disabled={loading || !rrValide}
              className="
                flex-1 py-4 px-6
                bg-gradient-to-r from-[var(--rb-primary)] to-[var(--rb-primary-dark)]
                text-white font-semibold rounded-xl
                shadow-lg shadow-[var(--rb-primary)]/25
                hover:shadow-xl hover:shadow-[var(--rb-primary)]/30
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
                flex items-center justify-center gap-2
              "
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Registreren...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Patiënt Registreren
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-4 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-all duration-200"
            >
              Annuleren
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
