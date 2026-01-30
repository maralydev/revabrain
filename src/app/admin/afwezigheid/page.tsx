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

  const typeColors: Record<AfwezigheidType, { bg: string; text: string; icon: string }> = {
    VAKANTIE: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: '' },
    ZIEKTE: { bg: 'bg-red-100', text: 'text-red-700', icon: '' },
    OPLEIDING: { bg: 'bg-blue-100', text: 'text-blue-700', icon: '' },
    ANDERE: { bg: 'bg-slate-100', text: 'text-slate-700', icon: '' },
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Afwezigheid Beheren
            </h1>
            <p className="text-slate-500 mt-1">
              Registreer vakantie, ziekte of andere afwezigheden
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(!showForm)}
              className={`
                px-5 py-2.5 font-semibold rounded-xl
                transition-all duration-200
                flex items-center gap-2
                ${showForm
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  : 'bg-gradient-to-r from-[var(--rb-primary)] to-[var(--rb-primary-dark)] text-white shadow-lg shadow-[var(--rb-primary)]/25 hover:shadow-xl hover:shadow-[var(--rb-primary)]/30'
                }
              `}
            >
              {showForm ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Annuleren
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Nieuwe Afwezigheid
                </>
              )}
            </button>
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
        </div>

        {/* Warning Message */}
        {warning && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <span className="font-medium">{warning}</span>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Nieuwe Afwezigheid</h2>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Type <span className="text-red-400">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as AfwezigheidType)}
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200 cursor-pointer"
                >
                  <option value="VAKANTIE">Vakantie</option>
                  <option value="ZIEKTE">Ziekte</option>
                  <option value="OPLEIDING">Opleiding</option>
                  <option value="ANDERE">Andere</option>
                </select>
              </div>

              {type === 'ANDERE' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Reden <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={reden}
                    onChange={(e) => setReden(e.target.value)}
                    required
                    placeholder="Geef een reden op..."
                    className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                  />
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-medium">{error}</span>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50/50 border-t border-slate-100">
              <button
                type="submit"
                disabled={saving}
                className="
                  w-full py-4 px-6
                  bg-gradient-to-r from-[var(--rb-primary)] to-[var(--rb-primary-dark)]
                  text-white font-semibold rounded-xl
                  shadow-lg shadow-[var(--rb-primary)]/25
                  hover:shadow-xl hover:shadow-[var(--rb-primary)]/30
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                  flex items-center justify-center gap-2
                "
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Aanmaken...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Afwezigheid Aanmaken
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
              Geregistreerde Afwezigheden
            </h2>
          </div>

          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-3 border-[var(--rb-primary)] border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-500 font-medium mt-4">Laden...</p>
            </div>
          ) : afwezigheden.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-slate-500 font-medium">Geen afwezigheden geregistreerd</p>
              <p className="text-slate-400 text-sm mt-1">Klik op &ldquo;Nieuwe Afwezigheid&rdquo; om te beginnen</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {afwezigheden.map((afwezigheid) => {
                const typeStyle = typeColors[afwezigheid.type as AfwezigheidType] || typeColors.ANDERE;
                return (
                  <div key={afwezigheid.id} className="p-5 hover:bg-slate-50/50 transition-colors duration-150 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${typeStyle.bg} rounded-xl flex items-center justify-center text-xl`}>
                        {typeStyle.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${typeStyle.text}`}>
                            {typeLabels[afwezigheid.type as AfwezigheidType] || afwezigheid.type}
                          </span>
                          {afwezigheid.reden && (
                            <span className="text-sm text-slate-500">({afwezigheid.reden})</span>
                          )}
                        </div>
                        <div className="text-sm text-slate-600 mt-1 flex items-center gap-2">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(afwezigheid.startDatum).toLocaleDateString('nl-BE')} - {new Date(afwezigheid.eindDatum).toLocaleDateString('nl-BE')}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(afwezigheid.id)}
                      className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Verwijderen
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
