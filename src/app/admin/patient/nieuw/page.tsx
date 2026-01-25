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
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#2879D8' }}>
          Nieuwe Patiënt Registreren
        </h1>
        <p className="text-gray-600 mt-2">
          Registreer een nieuwe patiënt via rijksregisternummer
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {/* Rijksregisternummer */}
        <div>
          <label htmlFor="rr" className="block text-sm font-medium text-gray-700">
            Rijksregisternummer *
          </label>
          <input
            id="rr"
            type="text"
            required
            value={rr}
            onChange={(e) => setRR(e.target.value)}
            placeholder="00.00.00-000.00"
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2879D8] ${
              rr && !rrValide ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {rr && !rrValide && rr.replace(/\D/g, '').length === 11 && (
            <p className="mt-1 text-sm text-red-600">Ongeldig rijksregisternummer (checksum fout)</p>
          )}
          {rrValide && afgeleideData && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded text-sm">
              <p>
                ✓ Valide RR - Geboren op{' '}
                {afgeleideData.geboortedatum?.toLocaleDateString('nl-BE')} (
                {afgeleideData.geslacht === 'M' ? 'Man' : 'Vrouw'})
              </p>
            </div>
          )}
        </div>

        {/* Naam */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="voornaam" className="block text-sm font-medium text-gray-700">
              Voornaam *
            </label>
            <input
              id="voornaam"
              type="text"
              required
              value={voornaam}
              onChange={(e) => setVoornaam(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2879D8]"
            />
          </div>
          <div>
            <label htmlFor="achternaam" className="block text-sm font-medium text-gray-700">
              Achternaam *
            </label>
            <input
              id="achternaam"
              type="text"
              required
              value={achternaam}
              onChange={(e) => setAchternaam(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2879D8]"
            />
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="telefoonnummer" className="block text-sm font-medium text-gray-700">
              Telefoonnummer *
            </label>
            <input
              id="telefoonnummer"
              type="tel"
              required
              value={telefoonnummer}
              onChange={(e) => setTelefoonnummer(e.target.value)}
              placeholder="+32 123 45 67 89"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2879D8]"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2879D8]"
            />
          </div>
        </div>

        {/* Adres */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Adres (optioneel)</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <input
                type="text"
                value={straat}
                onChange={(e) => setStraat(e.target.value)}
                placeholder="Straat"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2879D8]"
              />
            </div>
            <div>
              <input
                type="text"
                value={huisnummer}
                onChange={(e) => setHuisnummer(e.target.value)}
                placeholder="Nr"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2879D8]"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-3">
            <div>
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="Postcode"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2879D8]"
              />
            </div>
            <div className="col-span-2">
              <input
                type="text"
                value={gemeente}
                onChange={(e) => setGemeente(e.target.value)}
                placeholder="Gemeente"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2879D8]"
              />
            </div>
          </div>
        </div>

        {/* Contactpersoon */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Contactpersoon (voor kinderen/wilsonbekwamen)
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                value={contactpersoon}
                onChange={(e) => setContactpersoon(e.target.value)}
                placeholder="Naam contactpersoon"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2879D8]"
              />
            </div>
            <div>
              <input
                type="tel"
                value={contactpersoonTelefoon}
                onChange={(e) => setContactpersoonTelefoon(e.target.value)}
                placeholder="Telefoonnummer"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2879D8]"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || !rrValide}
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2879D8] hover:bg-[#1e60b0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2879D8] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registreren...' : 'Patiënt Registreren'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Annuleren
          </button>
        </div>
      </form>
    </div>
  );
}
