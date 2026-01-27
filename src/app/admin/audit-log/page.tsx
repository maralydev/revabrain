'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuditLogs, getActieTypes, type AuditLogFilters } from '@/modules/audit-log/queries';
import { getAllTeamleden } from '@/modules/teamlid/queries';
import type { AuditLogData } from '@/modules/audit-log/queries';
import type { Teamlid } from '@prisma/client';

export default function AuditLogPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLogData[]>([]);
  const [teamleden, setTeamleden] = useState<Teamlid[]>([]);
  const [actieTypes, setActieTypes] = useState<string[]>([]);
  const [totaal, setTotaal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [startDatum, setStartDatum] = useState('');
  const [eindDatum, setEindDatum] = useState('');
  const [selectedTeamlid, setSelectedTeamlid] = useState('');
  const [selectedActieType, setSelectedActieType] = useState('');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  const limit = 50;

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadLogs();
  }, [page, startDatum, eindDatum, selectedTeamlid, selectedActieType]);

  async function loadInitialData() {
    try {
      const [teamledenData, typesData] = await Promise.all([
        getAllTeamleden(),
        getActieTypes(),
      ]);
      setTeamleden(teamledenData);
      setActieTypes(typesData);
    } catch (err) {
      setError('Fout bij laden gegevens');
    }
  }

  async function loadLogs() {
    try {
      setLoading(true);
      setError('');

      const filters: AuditLogFilters = {
        limit,
        offset: (page - 1) * limit,
      };

      if (startDatum) filters.startDatum = new Date(startDatum);
      if (eindDatum) filters.eindDatum = new Date(eindDatum);
      if (selectedTeamlid) filters.teamlidId = Number(selectedTeamlid);
      if (selectedActieType) filters.actieType = selectedActieType;

      const result = await getAuditLogs(filters);
      setLogs(result.logs);
      setTotaal(result.totaal);
    } catch (err) {
      setError('Fout bij laden logs');
    } finally {
      setLoading(false);
    }
  }

  function handleExport() {
    if (logs.length === 0) return;

    const headers = [
      'Timestamp',
      'Gebruiker',
      'Actie Type',
      'Entiteit Type',
      'Entiteit ID',
      'Omschrijving',
    ];

    const rows = logs.map(log => [
      new Date(log.timestamp).toLocaleString('nl-BE'),
      log.teamlidNaam,
      log.actieType,
      log.entiteitType || '',
      log.entiteitId?.toString() || '',
      log.omschrijving,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-log_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function clearFilters() {
    setStartDatum('');
    setEindDatum('');
    setSelectedTeamlid('');
    setSelectedActieType('');
    setPage(1);
  }

  const totalPages = Math.ceil(totaal / limit);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Audit Log
            </h1>
            <p className="text-slate-500 mt-1">
              Bekijk alle systeemactiviteiten en wijzigingen
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

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4 text-[var(--rb-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Startdatum
                </label>
                <input
                  type="date"
                  value={startDatum}
                  onChange={(e) => {
                    setStartDatum(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Einddatum
                </label>
                <input
                  type="date"
                  value={eindDatum}
                  onChange={(e) => {
                    setEindDatum(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Gebruiker
                </label>
                <select
                  value={selectedTeamlid}
                  onChange={(e) => {
                    setSelectedTeamlid(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200 cursor-pointer"
                >
                  <option value="">Alle gebruikers</option>
                  {teamleden.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.voornaam} {t.achternaam}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Actie Type
                </label>
                <select
                  value={selectedActieType}
                  onChange={(e) => {
                    setSelectedActieType(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200 cursor-pointer"
                >
                  <option value="">Alle acties</option>
                  {actieTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                onClick={clearFilters}
                className="px-5 py-2.5 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Filters Wissen
              </button>
              <button
                onClick={handleExport}
                disabled={logs.length === 0}
                className="
                  px-5 py-2.5
                  bg-gradient-to-r from-emerald-500 to-emerald-600
                  text-white font-semibold rounded-xl
                  shadow-lg shadow-emerald-500/25
                  hover:shadow-xl hover:shadow-emerald-500/30
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                  flex items-center gap-2
                "
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Exporteer CSV
              </button>
            </div>
          </div>
        </div>

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

        {/* Results Info */}
        <div className="bg-slate-100/50 px-5 py-3 rounded-xl mb-4 flex items-center justify-between">
          <div className="text-sm text-slate-600 font-medium flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {totaal} log {totaal === 1 ? 'entry' : 'entries'} gevonden
            {totalPages > 1 && <span className="text-slate-400">(Pagina {page} van {totalPages})</span>}
          </div>
          {totalPages > 1 && (
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Vorige
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
              >
                Volgende
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Log Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-3 border-[var(--rb-primary)] border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-500 font-medium mt-4">Laden...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-slate-500 font-medium">Geen logs gevonden</p>
              <p className="text-slate-400 text-sm mt-1">Pas de filters aan om andere resultaten te zien</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100/50">
                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Gebruiker
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Actie
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Entiteit
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Omschrijving
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                      <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString('nl-BE')}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-slate-800">
                        {log.teamlidNaam}
                      </td>
                      <td className="px-5 py-4 text-sm">
                        <span className="px-2.5 py-1 bg-[var(--rb-primary)]/10 text-[var(--rb-primary)] rounded-lg text-xs font-semibold">
                          {log.actieType}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {log.entiteitType && (
                          <span className="flex items-center gap-1">
                            <span className="text-slate-500">{log.entiteitType}</span>
                            {log.entiteitId && (
                              <span className="text-slate-400 font-mono text-xs">#{log.entiteitId}</span>
                            )}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        {log.omschrijving}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
