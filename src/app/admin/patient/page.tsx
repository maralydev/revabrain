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
          <p className="text-gray-500 font-medium">Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
            Patiënten
          </h1>
          <p className="text-gray-500 mt-1">
            {searchQuery ? `${patienten.length} resultaten` : `${patienten.length} geregistreerde patiënten`}
          </p>
        </div>
        <Link
          href="/admin/patient/nieuw"
          className="
            inline-flex items-center justify-center gap-2 px-6 py-3
            bg-[var(--rb-primary)] text-white font-semibold rounded-xl
            shadow-md shadow-[var(--rb-primary)]/20
            hover:bg-[var(--rb-primary-dark)] hover:shadow-lg hover:shadow-[var(--rb-primary)]/30
            hover:-translate-y-0.5 active:scale-[0.98]
            transition-all duration-200
          "
        >
          <PlusIcon className="w-5 h-5" />
          Nieuwe Patiënt
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-2xl">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Zoek patiënt op naam of rijksregisternummer..."
            className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-[var(--rb-primary)] focus:border-[var(--rb-primary)] transition-all duration-200 text-gray-900 placeholder:text-gray-400"
          />
          {searching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-[var(--rb-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        {searchQuery.length > 0 && searchQuery.length < 2 && (
          <p className="mt-2 text-sm text-gray-500 ml-4">Voer minimaal 2 karakters in om te zoeken</p>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Patiënt
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Geboortedatum
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Gemeente
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Laatste Afspraak
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {patienten.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                      <UsersIcon className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium text-lg">
                      {searchQuery ? 'Geen patiënten gevonden' : 'Nog geen patiënten geregistreerd'}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {searchQuery ? 'Probeer een andere zoekterm' : 'Voeg je eerste patiënt toe om te beginnen'}
                    </p>
                  </td>
                </tr>
              ) : (
                patienten.map((patient, index) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-gray-50/80 transition-colors duration-150 group cursor-pointer"
                    style={{ animationDelay: `${index * 30}ms` }}
                    onClick={() => window.location.href = `/admin/patient/${patient.id}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--rb-primary)] to-[var(--rb-accent)] flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                          {patient.voornaam.charAt(0)}{patient.achternaam.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 group-hover:text-[var(--rb-primary)] transition-colors">
                            {patient.voornaam} {patient.achternaam}
                          </div>
                          <div className="text-sm text-gray-500 font-mono">{formatteerRR(patient.rijksregisternummer)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {new Date(patient.geboortedatum).toLocaleDateString('nl-BE')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{patient.telefoonnummer}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{patient.gemeente || <span className="text-gray-400">-</span>}</span>
                    </td>
                    <td className="px-6 py-4">
                      {patient.laatsteAfspraakDatum ? (
                        <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 rounded-lg text-gray-600 text-xs font-semibold">
                          <CalendarIcon className="w-3 h-3 mr-1.5" />
                          {new Date(patient.laatsteAfspraakDatum).toLocaleDateString('nl-BE')}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <ArrowRightIcon className="w-5 h-5 text-gray-300 group-hover:text-[var(--rb-primary)] group-hover:translate-x-1 transition-all duration-200" />
                      </div>
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

// Icons
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
