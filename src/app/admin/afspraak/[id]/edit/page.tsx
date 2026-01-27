'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getAfspraakById } from '@/modules/afspraak/queries';
import { updateAfspraak, cancelAfspraak, deleteAfspraak, updateAfspraakStatus, type AfspraakStatus, ConflictInfo } from '@/modules/afspraak/actions';
import { searchPatients, PatientWithLastAfspraak } from '@/modules/patient/queries';
import type { AfspraakWithRelations } from '@/modules/afspraak/queries';

export default function EditAfspraakPage() {
  const router = useRouter();
  const params = useParams();
  const afspraakId = Number(params.id);

  const [afspraak, setAfspraak] = useState<AfspraakWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [patientSearch, setPatientSearch] = useState('');
  const [searchResults, setSearchResults] = useState<PatientWithLastAfspraak[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientWithLastAfspraak | null>(null);

  const [datum, setDatum] = useState('');
  const [tijd, setTijd] = useState('');
  const [duur, setDuur] = useState<30 | 45 | 60 | 90>(60);
  const [type, setType] = useState<'INTAKE' | 'CONSULTATIE' | 'HUISBEZOEK' | 'ADMIN'>('CONSULTATIE');
  const [notities, setNotities] = useState('');
  const [isAlert, setIsAlert] = useState(false);
  const [status, setStatus] = useState<AfspraakStatus>('TE_BEVESTIGEN');

  const [conflicts, setConflicts] = useState<ConflictInfo[]>([]);
  const [error, setError] = useState('');

  // Load afspraak
  useEffect(() => {
    async function loadAfspraak() {
      try {
        setLoading(true);
        const data = await getAfspraakById(afspraakId);

        if (!data) {
          setError('Afspraak niet gevonden');
          return;
        }

        setAfspraak(data);

        // Set form fields
        const afspraakDatum = new Date(data.datum);
        setDatum(afspraakDatum.toISOString().split('T')[0]);
        setTijd(afspraakDatum.toTimeString().slice(0, 5));
        setDuur(data.duur as any);
        setType(data.type as any);
        setNotities(data.notities || '');
        setIsAlert((data as any).isAlert || false);
        setStatus(data.status as AfspraakStatus);

        // Set patient
        if (data.patient) {
          setSelectedPatient(data.patient as any);
        }
      } catch (err) {
        setError('Fout bij laden afspraak');
      } finally {
        setLoading(false);
      }
    }

    if (afspraakId) {
      loadAfspraak();
    }
  }, [afspraakId]);

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
    setSaving(true);

    try {
      if (!selectedPatient) {
        setError('Selecteer een patiënt');
        setSaving(false);
        return;
      }

      if (!datum || !tijd) {
        setError('Selecteer datum en tijd');
        setSaving(false);
        return;
      }

      const datumTijd = new Date(`${datum}T${tijd}:00`);

      const result = await updateAfspraak({
        afspraakId,
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
        setError(result.error || 'Fout bij wijzigen');
        if (result.conflicts) {
          setConflicts(result.conflicts);
        }
      }
    } catch (err) {
      setError('Er is een fout opgetreden');
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel() {
    if (!confirm('Weet je zeker dat je deze afspraak wilt annuleren? De afspraak blijft zichtbaar als geannuleerd.')) {
      return;
    }

    try {
      setSaving(true);
      const result = await cancelAfspraak(afspraakId);

      if (result.success) {
        router.push('/admin/agenda');
        router.refresh();
      } else {
        setError(result.error || 'Fout bij annuleren');
      }
    } catch (err) {
      setError('Er is een fout opgetreden');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Weet je zeker dat je deze afspraak PERMANENT wilt verwijderen? Dit kan niet ongedaan gemaakt worden.')) {
      return;
    }

    try {
      setSaving(true);
      const result = await deleteAfspraak(afspraakId);

      if (result.success) {
        router.push('/admin/agenda');
        router.refresh();
      } else {
        setError(result.error || 'Fout bij verwijderen');
      }
    } catch (err) {
      setError('Er is een fout opgetreden');
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(newStatus: AfspraakStatus) {
    try {
      const result = await updateAfspraakStatus(afspraakId, newStatus);

      if (result.success) {
        setStatus(newStatus);
        // Optionally show success message or refresh
      } else {
        setError(result.error || 'Fout bij statuswijziging');
      }
    } catch (err) {
      setError('Er is een fout opgetreden');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[var(--rb-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Laden...</p>
        </div>
      </div>
    );
  }

  if (!afspraak) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-slate-600 font-medium">{error || 'Afspraak niet gevonden'}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-slate-100 text-slate-600 font-medium rounded-xl hover:bg-slate-200 transition-all duration-200"
          >
            Terug
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Afspraak Wijzigen
          </h1>
          <p className="text-slate-500 mt-1">
            Pas de details van deze afspraak aan
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
                  onChange={(e) => setType(e.target.value as any)}
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

          {/* Status Section */}
          <div className="p-6 border-b border-slate-100">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Status <span className="text-red-400">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value as AfspraakStatus)}
              className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200 cursor-pointer"
            >
              <option value="TE_BEVESTIGEN">Te bevestigen</option>
              <option value="BEVESTIGD">Bevestigd</option>
              <option value="IN_WACHTZAAL">In wachtzaal</option>
              <option value="BINNEN">Binnen</option>
              <option value="AFGEWERKT">Afgewerkt</option>
              <option value="NO_SHOW">No-show</option>
              <option value="GEANNULEERD">Geannuleerd</option>
            </select>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Statuswijziging wordt direct opgeslagen
            </p>
          </div>

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
          <div className="p-6 space-y-4">
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving || !selectedPatient}
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
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Opslaan...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Wijzigingen Opslaan
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-4 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-all duration-200"
              >
                Terug
              </button>
            </div>

            {/* Danger Zone */}
            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Gevarenzone</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="
                    flex-1 py-3 px-4
                    bg-amber-50 border border-amber-200 text-amber-700 font-semibold rounded-xl
                    hover:bg-amber-100 hover:border-amber-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                    flex items-center justify-center gap-2
                  "
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Annuleren
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving}
                  className="
                    flex-1 py-3 px-4
                    bg-red-50 border border-red-200 text-red-700 font-semibold rounded-xl
                    hover:bg-red-100 hover:border-red-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                    flex items-center justify-center gap-2
                  "
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Verwijderen
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Annuleren behoudt de afspraak als geannuleerd in de agenda. Permanent verwijderen kan niet ongedaan gemaakt worden.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
