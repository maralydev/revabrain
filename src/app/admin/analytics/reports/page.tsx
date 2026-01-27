'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateTreatmentReport, type TreatmentReportData } from '@/modules/analytics/reports';

export default function ReportsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form state
  const [startDatum, setStartDatum] = useState('');
  const [eindDatum, setEindDatum] = useState('');
  const [error, setError] = useState('');

  // Results
  const [reportData, setReportData] = useState<TreatmentReportData[]>([]);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!startDatum || !eindDatum) {
        setError('Selecteer start- en einddatum');
        setLoading(false);
        return;
      }

      const result = await generateTreatmentReport({
        startDatum: new Date(startDatum),
        eindDatum: new Date(eindDatum),
      });

      if (result.success) {
        setReportData(result.data || []);
      } else {
        setError(result.error || 'Fout bij genereren rapport');
      }
    } catch (err) {
      setError('Er is een fout opgetreden');
    } finally {
      setLoading(false);
    }
  }

  function handleExport() {
    if (reportData.length === 0) return;

    const headers = [
      'Zorgverlener',
      'Totaal Afspraken',
      'Intakes',
      'Consultaties',
      'Huisbezoeken',
      'Afgewerkt',
      'No-Shows',
      'Geannuleerd',
    ];

    const rows = reportData.map(d => [
      d.zorgverlenerNaam,
      d.totaalAfspraken.toString(),
      d.intakes.toString(),
      d.consultaties.toString(),
      d.huisbezoeken.toString(),
      d.afgewerkt.toString(),
      d.noShows.toString(),
      d.geannuleerd.toString(),
    ]);

    // Calculate totals
    const totals = reportData.reduce(
      (acc, d) => ({
        totaal: acc.totaal + d.totaalAfspraken,
        intakes: acc.intakes + d.intakes,
        consultaties: acc.consultaties + d.consultaties,
        huisbezoeken: acc.huisbezoeken + d.huisbezoeken,
        afgewerkt: acc.afgewerkt + d.afgewerkt,
        noShows: acc.noShows + d.noShows,
        geannuleerd: acc.geannuleerd + d.geannuleerd,
      }),
      { totaal: 0, intakes: 0, consultaties: 0, huisbezoeken: 0, afgewerkt: 0, noShows: 0, geannuleerd: 0 }
    );

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
      '',
      'TOTAAL',
      [
        'Alle Zorgverleners',
        totals.totaal.toString(),
        totals.intakes.toString(),
        totals.consultaties.toString(),
        totals.huisbezoeken.toString(),
        totals.afgewerkt.toString(),
        totals.noShows.toString(),
        totals.geannuleerd.toString(),
      ].join(','),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `behandelingen-rapport_${startDatum}_${eindDatum}.csv`;
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
              Rapporten
            </h1>
            <p className="text-slate-500 mt-1">
              Genereer behandelingsrapporten per zorgverlener
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
        <form onSubmit={handleGenerate} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4 text-[var(--rb-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Behandelingen Rapport
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
                    Genereren...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Genereer Rapport
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

        {/* Report Table */}
        {reportData.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Behandelingen per Zorgverlener
              </h3>
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
                      Zorgverlener
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Totaal
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Intakes
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Consultaties
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Huisbezoeken
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Afgewerkt
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      No-Shows
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Geannuleerd
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reportData.map((row) => (
                    <tr key={row.zorgverlenerId} className="hover:bg-slate-50/50 transition-colors duration-150">
                      <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                        {row.zorgverlenerNaam}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-slate-800">
                        {row.totaalAfspraken}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                          {row.intakes}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                          {row.consultaties}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded-lg text-xs font-medium">
                          {row.huisbezoeken}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold">
                          {row.afgewerkt}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold">
                          {row.noShows}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {row.geannuleerd}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportData.length === 0 && !loading && startDatum && eindDatum && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">Geen behandelingen gevonden in deze periode</p>
          </div>
        )}
      </div>
    </div>
  );
}
