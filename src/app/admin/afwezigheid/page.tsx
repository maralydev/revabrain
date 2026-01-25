'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAfwezighedenByZorgverlener } from '@/modules/afwezigheid/queries';
import { createAfwezigheid, deleteAfwezigheid, type AfwezigheidType } from '@/modules/afwezigheid/actions';
import type { AfwezigheidRecord } from '@/modules/afwezigheid/queries';

export default function AfwezigheidPage() {
  const router = useRouter();
  const [afwezigheden, setAfwezigheden] = useState<AfwezigheidRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [startDatum, setStartDatum] = useState('');
  const [eindDatum, setEindDatum] = useState('');
  const [type, setType] = useState<AfwezigheidType>('VAKANTIE');
  const [reden, setReden] = useState('');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  useEffect(() => {
    loadAfwezigheden();
  }, []);

  async function loadAfwezigheden() {
    try {
      setLoading(true);
      const data = await getAfwezighedenByZorgverlener();
      setAfwezigheden(data);
    } catch (err) {
      setError('Fout bij laden afwezigheden');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setWarning('');
    setSaving(true);

    try {
      if (!startDatum || !eindDatum) {
        setError('Selecteer start- en einddatum');
        setSaving(false);
        return;
      }

      const start = new Date(startDatum);
      const eind = new Date(eindDatum);

      const result = await createAfwezigheid({
        startDatum: start,
        eindDatum: eind,
        type,
        reden: reden || undefined,
      });

      if (result.success) {
        if (result.conflictingAfspraken) {
          setWarning(`Afwezigheid aangemaakt. Let op: ${result.conflictingAfspraken} bestaande afspraken vallen in deze periode!`);
        }
        setShowForm(false);
        setStartDatum('');
        setEindDatum('');
        setReden('');
        loadAfwezigheden();
      } else {
        setError(result.error || 'Fout bij aanmaken');
      }
    } catch (err) {
      setError('Er is een fout opgetreden');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Weet je zeker dat je deze afwezigheid wilt verwijderen?')) {
      return;
    }

    try {
      const result = await deleteAfwezigheid(id);

      if (result.success) {
        loadAfwezigheden();
      } else {
        setError(result.error || 'Fout bij verwijderen');
      }
    } catch (err) {
      setError('Er is een fout opgetreden');
    }
  }

  const typeLabels: Record<AfwezigheidType, string> = {
    VAKANTIE: 'Vakantie',
    ZIEKTE: 'Ziekte',
    OPLEIDING: 'Opleiding',
    ANDERE: 'Andere',
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#2879D8' }}>
          Afwezigheid Beheren
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-[#2879D8] text-white rounded-md hover:bg-[#1e60b0]"
          >
            {showForm ? 'Annuleren' : '+ Nieuwe Afwezigheid'}
          </button>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Terug
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as AfwezigheidType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="VAKANTIE">Vakantie</option>
              <option value="ZIEKTE">Ziekte</option>
              <option value="OPLEIDING">Opleiding</option>
              <option value="ANDERE">Andere</option>
            </select>
          </div>

          {type === 'ANDERE' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reden *
              </label>
              <input
                type="text"
                value={reden}
                onChange={(e) => setReden(e.target.value)}
                required
                placeholder="Geef een reden op..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {warning && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
              {warning}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2 px-4 bg-[#2879D8] text-white rounded-md hover:bg-[#1e60b0] disabled:opacity-50"
          >
            {saving ? 'Aanmaken...' : 'Afwezigheid Aanmaken'}
          </button>
        </form>
      )}

      {/* List */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-6 text-gray-600">Laden...</div>
        ) : afwezigheden.length === 0 ? (
          <div className="p-6 text-gray-500">Geen afwezigheden geregistreerd</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {afwezigheden.map((afwezigheid) => (
              <div key={afwezigheid.id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">
                      {typeLabels[afwezigheid.type as AfwezigheidType] || afwezigheid.type}
                    </span>
                    {afwezigheid.reden && (
                      <span className="text-sm text-gray-500">({afwezigheid.reden})</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {new Date(afwezigheid.startDatum).toLocaleDateString('nl-BE')} - {new Date(afwezigheid.eindDatum).toLocaleDateString('nl-BE')}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(afwezigheid.id)}
                  className="text-red-600 hover:text-red-800 px-3 py-1"
                >
                  Verwijderen
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
