'use client';

import { useEffect, useState, useCallback } from 'react';
import { Patient } from '@prisma/client';
import Link from 'next/link';
import { getRecentPatients, searchPatients, PatientWithLastAfspraak } from '@/modules/patient/queries';
import { formatteerRR } from '@/shared/utils/rijksregisternummer';

export default function PatientOverzichtPage() {
  const [patienten, setPatienten] = useState<PatientWithLastAfspraak[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  // Load initial patients
  useEffect(() => {
    getRecentPatients(50)
      .then((data) => setPatienten(data.map((p) => ({ ...p, afspraken: [], laatsteAfspraakDatum: null }))))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 2) {
      // Reset to recent patients if search cleared
      if (searchQuery.length === 0) {
        setSearching(true);
        getRecentPatients(50)
          .then((data) => setPatienten(data.map((p) => ({ ...p, afspraken: [], laatsteAfspraakDatum: null }))))
          .catch(console.error)
          .finally(() => setSearching(false));
      }
      return;
    }

    setSearching(true);
    const timer = setTimeout(() => {
      searchPatients(searchQuery)
        .then(setPatienten)
        .catch(console.error)
        .finally(() => setSearching(false));
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#2879D8] border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#2879D8' }}>
            Patiënten
          </h1>
          <p className="text-gray-600 mt-1">
            {searchQuery ? `${patienten.length} resultaten` : `${patienten.length} geregistreerde patiënten`}
          </p>
        </div>
        <Link
          href="/admin/patient/nieuw"
          className="px-4 py-2 bg-[#2879D8] text-white rounded-md hover:bg-[#1e60b0] font-medium"
        >
          + Nieuwe Patiënt
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Zoek patiënt op naam of rijksregisternummer..."
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2879D8] focus:border-[#2879D8]"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-[#2879D8] border-r-transparent"></div>
            </div>
          )}
        </div>
        {searchQuery.length > 0 && searchQuery.length < 2 && (
          <p className="mt-2 text-sm text-gray-500">Voer minimaal 2 karakters in om te zoeken</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Naam
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Geboortedatum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telefoonnummer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gemeente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Laatste Afspraak
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patienten.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  {searchQuery ? 'Geen patiënten gevonden' : 'Nog geen patiënten geregistreerd'}
                </td>
              </tr>
            ) : (
              patienten.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {patient.voornaam} {patient.achternaam}
                    </div>
                    <div className="text-sm text-gray-500">{formatteerRR(patient.rijksregisternummer)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(patient.geboortedatum).toLocaleDateString('nl-BE')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.telefoonnummer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.gemeente || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.laatsteAfspraakDatum
                      ? new Date(patient.laatsteAfspraakDatum).toLocaleDateString('nl-BE')
                      : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
