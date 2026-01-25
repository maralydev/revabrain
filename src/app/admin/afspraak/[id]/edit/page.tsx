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
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-gray-600">Laden...</div>
      </div>
    );
  }

  if (!afspraak) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-red-600">{error || 'Afspraak niet gevonden'}</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#2879D8' }}>
        Afspraak Wijzigen
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {/* Patient Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Patiënt *
          </label>
          {selectedPatient ? (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
              <span className="font-medium">
                {selectedPatient.voornaam} {selectedPatient.achternaam}
              </span>
              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
                className="text-red-600 hover:text-red-800"
              >
                Wijzig
              </button>
            </div>
          ) : (
            <div>
              <input
                type="text"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                placeholder="Zoek patiënt op naam of RR..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {searchResults.length > 0 && (
                <div className="mt-2 border border-gray-300 rounded-md max-h-60 overflow-y-auto">
                  {searchResults.map((patient) => (
                    <button
                      key={patient.id}
                      type="button"
                      onClick={() => {
                        setSelectedPatient(patient);
                        setPatientSearch('');
                        setSearchResults([]);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b last:border-b-0"
                    >
                      <div className="font-medium">
                        {patient.voornaam} {patient.achternaam}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(patient.geboortedatum).toLocaleDateString('nl-BE')}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Datum en Tijd */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Datum *
            </label>
            <input
              type="date"
              value={datum}
              onChange={(e) => setDatum(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tijd *
            </label>
            <input
              type="time"
              value={tijd}
              onChange={(e) => setTijd(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Duur en Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duur *
            </label>
            <select
              value={duur}
              onChange={(e) => setDuur(Number(e.target.value) as 30 | 45 | 60 | 90)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value={30}>30 minuten</option>
              <option value={45}>45 minuten</option>
              <option value={60}>60 minuten</option>
              <option value={90}>90 minuten</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="CONSULTATIE">Consultatie</option>
              <option value="INTAKE">Intake</option>
              <option value="HUISBEZOEK">Huisbezoek</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>

        {/* Notities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notities
          </label>
          <textarea
            value={notities}
            onChange={(e) => setNotities(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as AfspraakStatus)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="TE_BEVESTIGEN">Te bevestigen</option>
            <option value="BEVESTIGD">Bevestigd</option>
            <option value="IN_WACHTZAAL">In wachtzaal</option>
            <option value="BINNEN">Binnen</option>
            <option value="AFGEWERKT">Afgewerkt</option>
            <option value="NO_SHOW">No-show</option>
            <option value="GEANNULEERD">Geannuleerd</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Statuswijziging wordt direct opgeslagen
          </p>
        </div>

        {/* Conflicts Warning */}
        {conflicts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <p className="font-medium text-red-800 mb-2">Conflicterende afspraken:</p>
            {conflicts.map((conflict) => (
              <div key={conflict.id} className="text-sm text-red-700">
                • {new Date(conflict.datum).toLocaleString('nl-BE')} ({conflict.duur} min)
                {conflict.patientNaam && ` - ${conflict.patientNaam}`}
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !conflicts.length && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving || !selectedPatient}
              className="flex-1 py-2 px-4 bg-[#2879D8] text-white rounded-md hover:bg-[#1e60b0] disabled:opacity-50"
            >
              {saving ? 'Opslaan...' : 'Wijzigingen Opslaan'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Terug
            </button>
          </div>

          {/* Danger Zone */}
          <div className="border-t border-gray-300 pt-3">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="flex-1 py-2 px-4 border border-orange-500 text-orange-600 rounded-md hover:bg-orange-50 disabled:opacity-50"
              >
                Afspraak Annuleren
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="flex-1 py-2 px-4 border border-red-500 text-red-600 rounded-md hover:bg-red-50 disabled:opacity-50"
              >
                Permanent Verwijderen
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Annuleren behoudt de afspraak als geannuleerd in de agenda. Permanent verwijderen kan niet ongedaan gemaakt worden.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
