'use client';

import { useEffect, useState } from 'react';
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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[var(--rb-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Patiënten
            </h1>
            <p className="text-slate-500 mt-1">
              {searchQuery ? `${patienten.length} resultaten` : `${patienten.length} geregistreerde patiënten`}
            </p>
          </div>
          <Link
            href="/admin/patient/nieuw"
            className="
              flex items-center gap-2 px-6 py-3
              bg-gradient-to-r from-[var(--rb-primary)] to-[var(--rb-primary-dark)]
              text-white font-semibold rounded-xl
              shadow-lg shadow-[var(--rb-primary)]/25
              hover:shadow-xl hover:shadow-[var(--rb-primary)]/30 hover:scale-[1.02]
              active:scale-[0.98]
              transition-all duration-200
            "
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nieuwe Patiënt
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Zoek patiënt op naam of rijksregisternummer..."
              className="w-full pl-12 pr-12 py-4 bg-white/80 backdrop-blur-sm border-0 rounded-2xl shadow-sm focus:ring-2 focus:ring-[var(--rb-primary)] transition-all duration-200 text-slate-800 placeholder:text-slate-400"
            />
            {searching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-[var(--rb-primary)] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          {searchQuery.length > 0 && searchQuery.length < 2 && (
            <p className="mt-2 text-sm text-slate-500 ml-4">Voer minimaal 2 karakters in om te zoeken</p>
          )}
        </div>

        {/* Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-50 to-slate-100/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Naam
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Geboortedatum
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Telefoonnummer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Gemeente
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Laatste Afspraak
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patienten.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <p className="text-slate-500 font-medium">
                      {searchQuery ? 'Geen patiënten gevonden' : 'Nog geen patiënten geregistreerd'}
                    </p>
                  </td>
                </tr>
              ) : (
                patienten.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-slate-50/50 transition-colors duration-150 cursor-pointer"
                    onClick={() => window.location.href = `/admin/patient/${patient.id}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[var(--rb-primary)] to-[var(--rb-accent)] rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                          {patient.voornaam.charAt(0)}{patient.achternaam.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">
                            {patient.voornaam} {patient.achternaam}
                          </div>
                          <div className="text-sm text-slate-500 font-mono">{formatteerRR(patient.rijksregisternummer)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(patient.geboortedatum).toLocaleDateString('nl-BE')}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {patient.telefoonnummer}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {patient.gemeente || <span className="text-slate-400">-</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {patient.laatsteAfspraakDatum ? (
                        <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600 text-xs font-medium">
                          {new Date(patient.laatsteAfspraakDatum).toLocaleDateString('nl-BE')}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
