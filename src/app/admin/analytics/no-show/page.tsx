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
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#2879D8' }}>
          No-Show Analyse
        </h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Terug
        </button>
      </div>

      {/* Filter Form */}
      <form onSubmit={handleAnalyze} className="bg-white p-6 rounded-lg shadow mb-6">
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
            {loading ? 'Analyseren...' : 'Analyseer'}
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </form>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">Totaal Afspraken</div>
            <div className="text-3xl font-bold text-gray-900">{stats.totaalAfspraken}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">Totaal No-Shows</div>
            <div className="text-3xl font-bold text-orange-600">{stats.totaalNoShows}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-sm text-gray-500 mb-1">No-Show Percentage</div>
            <div className={`text-3xl font-bold ${stats.noShowPercentage > 10 ? 'text-red-600' : 'text-green-600'}`}>
              {stats.noShowPercentage}%
            </div>
          </div>
        </div>
      )}

      {/* Patient List */}
      {patienten.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">
              Patiënten met No-Shows ({patienten.length})
            </h2>
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
                    Patiënt
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    No-Shows
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Totaal Afspraken
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    No-Show %
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Laatste No-Show
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {patienten.map((patient) => {
                  const percentage = (patient.noShowCount / patient.totaalAfspraken) * 100;
                  return (
                    <tr key={patient.patientId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {patient.patientNaam}
                      </td>
                      <td className="px-4 py-3 text-sm text-orange-600 font-semibold">
                        {patient.noShowCount}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {patient.totaalAfspraken}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`font-semibold ${percentage > 20 ? 'text-red-600' : percentage > 10 ? 'text-orange-600' : 'text-gray-600'}`}>
                          {percentage.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
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
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          Geen no-shows gevonden in deze periode
        </div>
      )}
    </div>
  );
}
