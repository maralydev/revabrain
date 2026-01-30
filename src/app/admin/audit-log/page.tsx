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

  const getActionIcon = (actionType: string) => {
    const icons: Record<string, { icon: React.ReactNode; color: string }> = {
      CREATE: {
        icon: <PlusIcon className="w-4 h-4" />,
        color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
      },
      UPDATE: {
        icon: <EditIcon className="w-4 h-4" />,
        color: 'bg-[var(--rb-light)] text-[var(--rb-primary)] border-[var(--rb-primary)]/20'
      },
      DELETE: {
        icon: <TrashIcon className="w-4 h-4" />,
        color: 'bg-red-50 text-red-600 border-red-200'
      },
      LOGIN: {
        icon: <LoginIcon className="w-4 h-4" />,
        color: 'bg-purple-50 text-purple-600 border-purple-200'
      },
      LOGOUT: {
        icon: <LogoutIcon className="w-4 h-4" />,
        color: 'bg-gray-100 text-gray-600 border-gray-200'
      },
    };
    return icons[actionType] || { icon: <ActivityIcon className="w-4 h-4" />, color: 'bg-gray-50 text-gray-600 border-gray-200' };
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
            Audit Log
          </h1>
          <p className="text-gray-500 mt-1">
            Bekijk alle systeemactiviteiten en wijzigingen
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Terug
        </button>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <FilterIcon className="w-4 h-4 text-[var(--rb-primary)]" />
            Filters
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Startdatum
              </label>
              <input
                type="date"
                value={startDatum}
                onChange={(e) => {
                  setStartDatum(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:border-[var(--rb-primary)] focus:bg-white transition-all duration-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Einddatum
              </label>
              <input
                type="date"
                value={eindDatum}
                onChange={(e) => {
                  setEindDatum(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:border-[var(--rb-primary)] focus:bg-white transition-all duration-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Gebruiker
              </label>
              <select
                value={selectedTeamlid}
                onChange={(e) => {
                  setSelectedTeamlid(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:border-[var(--rb-primary)] focus:bg-white transition-all duration-200 text-sm cursor-pointer"
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
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Actie Type
              </label>
              <select
                value={selectedActieType}
                onChange={(e) => {
                  setSelectedActieType(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:border-[var(--rb-primary)] focus:bg-white transition-all duration-200 text-sm cursor-pointer"
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
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200"
            >
              <CloseIcon className="w-4 h-4" />
              Filters Wissen
            </button>
            <button
              onClick={handleExport}
              disabled={logs.length === 0}
              className="
                inline-flex items-center gap-2 px-4 py-2.5
                bg-emerald-500 text-white font-medium rounded-xl
                shadow-md shadow-emerald-500/20
                hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/30
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
              "
            >
              <DownloadIcon className="w-4 h-4" />
              Exporteer CSV
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertIcon className="w-5 h-5" />
          </div>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Results Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 text-gray-600 font-medium">
            <FileTextIcon className="w-4 h-4 text-gray-400" />
            {totaal} {totaal === 1 ? 'log entry' : 'log entries'}
          </span>
          {totalPages > 1 && (
            <span className="text-gray-400">
              Pagina {page} van {totalPages}
            </span>
          )}
        </div>
        {totalPages > 1 && (
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Vorige
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Volgende
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Log Table - Modern Styling */}
      <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-3 border-[var(--rb-primary)] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 font-medium mt-4">Laden...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
              <FileTextIcon className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium text-lg">Geen logs gevonden</p>
            <p className="text-gray-400 text-sm mt-1">Pas de filters aan om andere resultaten te zien</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tijd
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Gebruiker
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actie
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Entiteit
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Omschrijving
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log, index) => {
                  const actionStyle = getActionIcon(log.actieType);
                  return (
                    <tr 
                      key={log.id} 
                      className="hover:bg-gray-50/80 transition-colors duration-150 group"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(log.timestamp).toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(log.timestamp).toLocaleDateString('nl-BE')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--rb-primary)] to-[var(--rb-accent)] flex items-center justify-center text-white font-semibold text-sm">
                            {log.teamlidNaam.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{log.teamlidNaam}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border ${actionStyle.color}`}>
                          {actionStyle.icon}
                          {log.actieType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {log.entiteitType ? (
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-700">{log.entiteitType}</span>
                            {log.entiteitId && (
                              <span className="text-xs text-gray-400 font-mono">#{log.entiteitId}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 max-w-md truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all">
                          {log.omschrijving}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Icons
function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function FileTextIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function LoginIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

function ActivityIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}
