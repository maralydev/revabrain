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

  const typeIcons: Record<AfwezigheidType, string> = {
    VAKANTIE: '🏖️',
    ZIEKTE: '🤒',
    OPLEIDING: '📚',
    ANDERE: '📝',
  };

  const typeColors: Record<AfwezigheidType, { bg: string; border: string; text: string; iconBg: string }> = {
    VAKANTIE: { 
      bg: 'bg-emerald-50', 
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      iconBg: 'bg-emerald-100'
    },
    ZIEKTE: { 
      bg: 'bg-red-50', 
      border: 'border-red-200',
      text: 'text-red-700',
      iconBg: 'bg-red-100'
    },
    OPLEIDING: { 
      bg: 'bg-[var(--rb-light)]', 
      border: 'border-[var(--rb-primary)]/20',
      text: 'text-[var(--rb-primary)]',
      iconBg: 'bg-[var(--rb-primary)]/10'
    },
    ANDERE: { 
      bg: 'bg-gray-50', 
      border: 'border-gray-200',
      text: 'text-gray-700',
      iconBg: 'bg-gray-100'
    },
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
            Afwezigheid
          </h1>
          <p className="text-gray-500 mt-1">
            Registreer vakantie, ziekte of andere afwezigheden
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowForm(!showForm)}
            className={`
              inline-flex items-center gap-2 px-5 py-2.5
              font-semibold rounded-xl transition-all duration-200
              shadow-md hover:shadow-lg active:scale-[0.98]
              ${showForm
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-[var(--rb-primary)] text-white hover:bg-[var(--rb-primary-dark)] shadow-[var(--rb-primary)]/20'
              }
            `}
          >
            {showForm ? (
              <>
                <CloseIcon className="w-5 h-5" />
                Annuleren
              </>
            ) : (
              <>
                <PlusIcon className="w-5 h-5" />
                Nieuwe Afwezigheid
              </>
            )}
          </button>
        </div>
      </div>

      {/* Warning Message */}
      {warning && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertIcon className="w-5 h-5" />
          </div>
          <span className="font-medium">{warning}</span>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="mb-8 bg-white rounded-2xl shadow-[var(--shadow-card)] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-900">Nieuwe Afwezigheid</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Startdatum <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={startDatum}
                  onChange={(e) => setStartDatum(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:border-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Einddatum <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={eindDatum}
                  onChange={(e) => setEindDatum(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:border-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(Object.keys(typeLabels) as AfwezigheidType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200
                      ${type === t 
                        ? 'border-[var(--rb-primary)] bg-[var(--rb-light)]' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                      }
                    `}
                  >
                    <span className="text-2xl">{typeIcons[t]}</span>
                    <span className="font-medium text-sm">{typeLabels[t]}</span>
                  </button>
                ))}
              </div>
            </div>

            {type === 'ANDERE' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reden <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={reden}
                  onChange={(e) => setReden(e.target.value)}
                  required
                  placeholder="Geef een reden op..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:border-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                />
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertIcon className="w-5 h-5" />
                </div>
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="
                  flex-1 py-3.5 px-6
                  bg-[var(--rb-primary)] text-white font-semibold rounded-xl
                  shadow-md shadow-[var(--rb-primary)]/20
                  hover:bg-[var(--rb-primary-dark)] hover:shadow-lg hover:shadow-[var(--rb-primary)]/30
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
                    <CheckIcon className="w-5 h-5" />
                    Afwezigheid Aanmaken
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
              >
                Annuleren
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Geregistreerde Afwezigheden
          </h2>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-3 border-[var(--rb-primary)] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 font-medium mt-4">Laden...</p>
          </div>
        ) : afwezigheden.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
              <CalendarIcon className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium text-lg">Geen afwezigheden geregistreerd</p>
            <p className="text-gray-400 text-sm mt-1">Klik op "Nieuwe Afwezigheid" om te beginnen</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {afwezigheden.map((afwezigheid) => {
              const typeStyle = typeColors[afwezigheid.type as AfwezigheidType];
              return (
                <div 
                  key={afwezigheid.id} 
                  className="p-5 hover:bg-gray-50/50 transition-colors duration-150 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${typeStyle.iconBg} rounded-xl flex items-center justify-center text-2xl`}>
                      {typeIcons[afwezigheid.type as AfwezigheidType]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${typeStyle.text}`}>
                          {typeLabels[afwezigheid.type as AfwezigheidType]}
                        </span>
                        {afwezigheid.reden && (
                          <span className="text-sm text-gray-500">({afwezigheid.reden})</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        {new Date(afwezigheid.startDatum).toLocaleDateString('nl-BE')} - {new Date(afwezigheid.eindDatum).toLocaleDateString('nl-BE')}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(afwezigheid.id)}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 flex items-center gap-2 opacity-0 group-hover:opacity-100"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Verwijderen
                  </button>
                </div>
              );
            })}
          </div>
        )}
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

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}
