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
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#2879D8' }}>
          Audit Log
        </h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Terug
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Startdatum
            </label>
            <input
              type="date"
              value={startDatum}
              onChange={(e) => {
                setStartDatum(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Einddatum
            </label>
            <input
              type="date"
              value={eindDatum}
              onChange={(e) => {
                setEindDatum(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gebruiker
            </label>
            <select
              value={selectedTeamlid}
              onChange={(e) => {
                setSelectedTeamlid(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actie Type
            </label>
            <select
              value={selectedActieType}
              onChange={(e) => {
                setSelectedActieType(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
        <div className="mt-4 flex gap-2">
          <button
            onClick={clearFilters}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Filters Wissen
          </button>
          <button
            onClick={handleExport}
            disabled={logs.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            Exporteer CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Results Info */}
      <div className="bg-gray-50 px-4 py-3 rounded mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {totaal} log {totaal === 1 ? 'entry' : 'entries'} gevonden
          {totalPages > 1 && ` (Pagina ${page} van ${totalPages})`}
        </div>
        {totalPages > 1 && (
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-gray-300 rounded-md hover:bg-white disabled:opacity-50"
            >
              Vorige
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md hover:bg-white disabled:opacity-50"
            >
              Volgende
            </button>
          </div>
        )}
      </div>

      {/* Log Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-gray-600">Laden...</div>
        ) : logs.length === 0 ? (
          <div className="p-6 text-gray-500">Geen logs gevonden</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Gebruiker
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actie
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Entiteit
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Omschrijving
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('nl-BE')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {log.teamlidNaam}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {log.actieType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {log.entiteitType && (
                        <span>
                          {log.entiteitType}
                          {log.entiteitId && ` #${log.entiteitId}`}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
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
  );
}
