'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeNoShows, type PatientNoShowInfo, type NoShowStats } from '@/modules/analytics/no-show';

export default function NoShowAnalysisPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form state
  const [startDatum, setStartDatum] = useState('');
  const [eindDatum, setEindDatum] = useState('');
  const [error, setError] = useState('');

  // Results
  const [stats, setStats] = useState<NoShowStats | null>(null);
  const [patienten, setPatienten] = useState<PatientNoShowInfo[]>([]);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!startDatum || !eindDatum) {
        setError('Selecteer start- en einddatum');
        setLoading(false);
        return;
      }

      const result = await analyzeNoShows({
        startDatum: new Date(startDatum),
        eindDatum: new Date(eindDatum),
      });

      if (result.success) {
        setStats(result.stats || null);
        setPatienten(result.patienten || []);
      } else {
        setError(result.error || 'Fout bij analyseren');
      }
    } catch (err) {
      setError('Er is een fout opgetreden');
    } finally {
      setLoading(false);
    }
  }

  function handleExport() {
    if (!stats || patienten.length === 0) return;

    // Create CSV
    const headers = ['Patiënt', 'No-Shows', 'Totaal Afspraken', 'No-Show %', 'Laatste No-Show'];
    const rows = patienten.map(p => [
      p.patientNaam,
      p.noShowCount.toString(),
      p.totaalAfspraken.toString(),
      ((p.noShowCount / p.totaalAfspraken) * 100).toFixed(1) + '%',
      p.laatsteNoShow ? new Date(p.laatsteNoShow).toLocaleDateString('nl-BE') : '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
      '',
      'Totaal',
      `"Afspraken: ${stats.totaalAfspraken}"`,
      `"No-Shows: ${stats.totaalNoShows}"`,
      `"Percentage: ${stats.noShowPercentage}%"`,
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `no-show-analyse_${startDatum}_${eindDatum}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              No-Show Analyse
            </h1>
            <p className="text-slate-500 mt-1">
              Analyseer patiënten met gemiste afspraken
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

        {/* Filter Form */}
        <form onSubmit={handleAnalyze} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4 text-[var(--rb-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Periode Selecteren
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Startdatum <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={startDatum}
                  onChange={(e) => setStartDatum(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Einddatum <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={eindDatum}
                  onChange={(e) => setEindDatum(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="
                  py-3 px-6
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
                    Analyseren...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Analyseer
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-medium">{error}</span>
              </div>
            )}
          </div>
        </form>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-slate-500 font-medium">Totaal Afspraken</div>
                  <div className="text-3xl font-bold text-slate-800">{stats.totaalAfspraken}</div>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-slate-500 font-medium">Totaal No-Shows</div>
                  <div className="text-3xl font-bold text-amber-600">{stats.totaalNoShows}</div>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stats.noShowPercentage > 10 ? 'bg-red-100' : 'bg-emerald-100'}`}>
                  <svg className={`w-6 h-6 ${stats.noShowPercentage > 10 ? 'text-red-600' : 'text-emerald-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-slate-500 font-medium">No-Show Percentage</div>
                  <div className={`text-3xl font-bold ${stats.noShowPercentage > 10 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {stats.noShowPercentage}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Patient List */}
        {patienten.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Patiënten met No-Shows ({patienten.length})
              </h2>
              <button
                onClick={handleExport}
                className="
                  px-5 py-2.5
                  bg-gradient-to-r from-emerald-500 to-emerald-600
                  text-white font-semibold rounded-xl
                  shadow-lg shadow-emerald-500/25
                  hover:shadow-xl hover:shadow-emerald-500/30
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100/50">
                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Patiënt
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      No-Shows
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Totaal Afspraken
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      No-Show %
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Laatste No-Show
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patienten.map((patient) => {
                    const percentage = (patient.noShowCount / patient.totaalAfspraken) * 100;
                    return (
                      <tr key={patient.patientId} className="hover:bg-slate-50/50 transition-colors duration-150">
                        <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                          {patient.patientNaam}
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold text-amber-600">
                          {patient.noShowCount}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {patient.totaalAfspraken}
                        </td>
                        <td className="px-5 py-4 text-sm">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            percentage > 20
                              ? 'bg-red-100 text-red-700'
                              : percentage > 10
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-slate-100 text-slate-600'
                          }`}>
                            {percentage.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          {patient.laatsteNoShow
                            ? new Date(patient.laatsteNoShow).toLocaleDateString('nl-BE')
                            : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {stats && patienten.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-slate-600 font-medium">Geen no-shows gevonden in deze periode</p>
            <p className="text-slate-400 text-sm mt-1">Uitstekend! Alle patiënten zijn op hun afspraken gekomen.</p>
          </div>
        )}
      </div>
    </div>
  );
}
