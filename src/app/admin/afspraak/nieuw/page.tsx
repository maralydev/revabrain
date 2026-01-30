'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { searchPatients, PatientWithLastAfspraak } from '@/modules/patient/queries';
import { createAfspraak, ConflictInfo } from '@/modules/afspraak/actions';
import { createRecurringAfspraak, type Frequentie } from '@/modules/afspraak/recurring';

export default function NieuweAfspraakPage() {
  const router = useRouter();
  const [patientSearch, setPatientSearch] = useState('');
  const [searchResults, setSearchResults] = useState<PatientWithLastAfspraak[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientWithLastAfspraak | null>(null);

  const [datum, setDatum] = useState('');
  const [tijd, setTijd] = useState('');
  const [duur, setDuur] = useState<30 | 45 | 60 | 90>(60);
  const [type, setType] = useState<'INTAKE' | 'CONSULTATIE' | 'HUISBEZOEK' | 'ADMIN'>('CONSULTATIE');
  const [notities, setNotities] = useState('');
  const [isAlert, setIsAlert] = useState(false);

  const [isRecurring, setIsRecurring] = useState(false);
  const [totaalSessies, setTotaalSessies] = useState(12);
  const [frequentie, setFrequentie] = useState<Frequentie>('WEKELIJKS');
  const [plannedDates, setPlannedDates] = useState<Date[]>([]);

  const [conflicts, setConflicts] = useState<ConflictInfo[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Patient search
  useEffect(() => {
    if (patientSearch.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      searchPatients(patientSearch)
        .then(setSearchResults)
        .catch(console.error);
    }, 300);

    return () => clearTimeout(timer);
  }, [patientSearch]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setConflicts([]);
    setPlannedDates([]);
    setLoading(true);

    try {
      if (!selectedPatient) {
        setError('Selecteer een patiënt');
        setLoading(false);
        return;
      }

      if (!datum || !tijd) {
        setError('Selecteer datum en tijd');
        setLoading(false);
        return;
      }

      const datumTijd = new Date(`${datum}T${tijd}:00`);

      if (isRecurring) {
        // Create recurring appointments
        const result = await createRecurringAfspraak({
          patientId: selectedPatient.id,
          startDatum: datumTijd,
          duur,
          type,
          totaalSessies,
          frequentie,
          notities: notities || undefined,
        });

        if (result.success) {
          router.push('/admin/agenda');
          router.refresh();
        } else {
          setError(result.error || 'Fout bij aanmaken herhalende reeks');
          if (result.conflicts) {
            setConflicts(result.conflicts);
          }
          if (result.plannedDates) {
            setPlannedDates(result.plannedDates);
          }
        }
      } else {
        // Create single appointment
        const result = await createAfspraak({
          patientId: selectedPatient.id,
          datum: datumTijd,
          duur,
          type,
          notities: notities || undefined,
          isAlert,
        });

        if (result.success) {
          router.push('/admin/agenda');
          router.refresh();
        } else {
          setError(result.error || 'Fout bij aanmaken');
          if (result.conflicts) {
            setConflicts(result.conflicts);
          }
        }
      }
    } catch (err) {
      setError('Er is een fout opgetreden');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Nieuwe Afspraak
          </h1>
          <p className="text-slate-500 mt-1">
            Plan een nieuwe afspraak in voor een patiënt
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Patient Selector Section */}
          <div className="p-6 border-b border-slate-100">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Patiënt <span className="text-red-400">*</span>
            </label>
            {selectedPatient ? (
              <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[var(--rb-primary)] to-[var(--rb-accent)] rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                    {selectedPatient.voornaam.charAt(0)}{selectedPatient.achternaam.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">
                      {selectedPatient.voornaam} {selectedPatient.achternaam}
                    </div>
                    <div className="text-sm text-slate-500">
                      {new Date(selectedPatient.geboortedatum).toLocaleDateString('nl-BE')}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPatient(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  Wijzig
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  placeholder="Zoek patiënt op naam of RR..."
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                />
                {searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-slate-100 max-h-60 overflow-y-auto">
                    {searchResults.map((patient) => (
                      <button
                        key={patient.id}
                        type="button"
                        onClick={() => {
                          setSelectedPatient(patient);
                          setPatientSearch('');
                          setSearchResults([]);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-b-0 transition-colors duration-150"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center text-slate-600 font-medium text-xs">
                            {patient.voornaam.charAt(0)}{patient.achternaam.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">
                              {patient.voornaam} {patient.achternaam}
                            </div>
                            <div className="text-sm text-slate-500">
                              {new Date(patient.geboortedatum).toLocaleDateString('nl-BE')}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Date & Time Section */}
          <div className="p-6 border-b border-slate-100 space-y-5">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Datum & Tijd</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Datum <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={datum}
                  onChange={(e) => setDatum(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tijd <span className="text-red-400">*</span>
                </label>
                <input
                  type="time"
                  value={tijd}
                  onChange={(e) => setTijd(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Type & Duration Section */}
          <div className="p-6 border-b border-slate-100 space-y-5">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Duur <span className="text-red-400">*</span>
                </label>
                <select
                  value={duur}
                  onChange={(e) => setDuur(Number(e.target.value) as 30 | 45 | 60 | 90)}
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200 cursor-pointer"
                >
                  <option value={30}>30 minuten</option>
                  <option value={45}>45 minuten</option>
                  <option value={60}>60 minuten</option>
                  <option value={90}>90 minuten</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Type <span className="text-red-400">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'INTAKE' | 'CONSULTATIE' | 'HUISBEZOEK' | 'ADMIN')}
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200 cursor-pointer"
                >
                  <option value="CONSULTATIE">Consultatie</option>
                  <option value="INTAKE">Intake</option>
                  <option value="HUISBEZOEK">Huisbezoek</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="p-6 border-b border-slate-100 space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
              Notities <span className="text-slate-400 font-normal normal-case">(optioneel)</span>
            </h3>
            <textarea
              value={notities}
              onChange={(e) => setNotities(e.target.value)}
              rows={3}
              placeholder="Eventuele opmerkingen..."
              className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200 resize-none"
            />
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isAlert}
                  onChange={(e) => setIsAlert(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 bg-slate-100 border-2 border-slate-200 rounded-md peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all duration-200" />
                <svg className="absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
                Markeer als alert (belangrijke notitie)
              </span>
            </label>
          </div>

          {/* Recurring Section */}
          <div className="p-6 border-b border-slate-100">
            <label className="flex items-center gap-3 cursor-pointer group mb-4">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 bg-slate-100 border-2 border-slate-200 rounded-md peer-checked:bg-[var(--rb-primary)] peer-checked:border-[var(--rb-primary)] transition-all duration-200" />
                <svg className="absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                  Herhalende afspraken (reeks)
                </span>
                <p className="text-xs text-slate-500">Plan meerdere afspraken in één keer</p>
              </div>
            </label>

            {isRecurring && (
              <div className="mt-4 p-4 bg-[var(--rb-primary)]/5 border border-[var(--rb-primary)]/10 rounded-xl space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Aantal sessies <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      min="2"
                      max="52"
                      value={totaalSessies}
                      onChange={(e) => setTotaalSessies(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-white border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Frequentie <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={frequentie}
                      onChange={(e) => setFrequentie(e.target.value as Frequentie)}
                      className="w-full px-4 py-3 bg-white border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] transition-all duration-200 cursor-pointer"
                    >
                      <option value="WEKELIJKS">Wekelijks</option>
                      <option value="TWEEMAAL_PER_WEEK">Tweemaal per week</option>
                      <option value="MAANDELIJKS">Maandelijks</option>
                    </select>
                  </div>
                </div>
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--rb-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Dit zal {totaalSessies} afspraken aanmaken vanaf de gekozen startdatum.
                </p>
              </div>
            )}
          </div>

          {/* Planned Dates Preview */}
          {plannedDates.length > 0 && (
            <div className="mx-6 mt-6 p-4 bg-[var(--rb-primary)]/5 border border-[var(--rb-primary)]/10 rounded-xl">
              <p className="font-semibold text-[var(--rb-primary)] mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Geplande datums:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {plannedDates.map((date, index) => (
                  <div key={index} className="text-sm text-slate-600 bg-white px-3 py-1.5 rounded-lg">
                    {index + 1}. {new Date(date).toLocaleDateString('nl-BE')}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conflicts Warning */}
          {conflicts.length > 0 && (
            <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-100 rounded-xl">
              <p className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Conflicterende afspraken:
              </p>
              {conflicts.map((conflict) => (
                <div key={conflict.id} className="text-sm text-red-600 ml-7">
                  {new Date(conflict.datum).toLocaleString('nl-BE')} ({conflict.duur} min)
                  {conflict.patientNaam && ` - ${conflict.patientNaam}`}
                </div>
              ))}
            </div>
          )}

          {/* Error Message */}
          {error && !conflicts.length && (
            <div className="mx-6 mt-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-100">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="p-6 flex gap-3">
            <button
              type="submit"
              disabled={loading || !selectedPatient}
              className="
                flex-1 py-4 px-6
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
                  Inplannen...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {isRecurring ? 'Reeks Inplannen' : 'Afspraak Inplannen'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-4 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-all duration-200"
            >
              Annuleren
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
