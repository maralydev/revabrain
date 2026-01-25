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
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#2879D8' }}>
          Rapporten
        </h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Terug
        </button>
      </div>

      {/* Filter Form */}
      <form onSubmit={handleGenerate} className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Behandelingen Rapport</h2>
        <div className="grid grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Startdatum *
            </label>
            <input
              type="date"
              value={startDatum}
              onChange={(e) => setStartDatum(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Einddatum *
            </label>
            <input
              type="date"
              value={eindDatum}
              onChange={(e) => setEindDatum(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#2879D8] text-white rounded-md hover:bg-[#1e60b0] disabled:opacity-50"
          >
            {loading ? 'Genereren...' : 'Genereer Rapport'}
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </form>

      {/* Report Table */}
      {reportData.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              Behandelingen per Zorgverlener
            </h3>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Exporteer CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Zorgverlener
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Totaal
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Intakes
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Consultaties
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Huisbezoeken
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Afgewerkt
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    No-Shows
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Geannuleerd
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportData.map((row) => (
                  <tr key={row.zorgverlenerId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {row.zorgverlenerNaam}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {row.totaalAfspraken}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {row.intakes}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {row.consultaties}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {row.huisbezoeken}
                    </td>
                    <td className="px-4 py-3 text-sm text-green-600 font-medium">
                      {row.afgewerkt}
                    </td>
                    <td className="px-4 py-3 text-sm text-orange-600 font-medium">
                      {row.noShows}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
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
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          Geen behandelingen gevonden in deze periode
        </div>
      )}
    </div>
  );
}
