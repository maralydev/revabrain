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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#2879D8' }}>
        Nieuwe Afspraak Inplannen
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
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="isAlert"
              checked={isAlert}
              onChange={(e) => setIsAlert(e.target.checked)}
              className="w-4 h-4 text-[#2879D8] border-gray-300 rounded"
            />
            <label htmlFor="isAlert" className="text-sm text-gray-700">
              Markeer als alert (belangrijke notitie)
            </label>
          </div>
        </div>

        {/* Herhalende Afspraken */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              id="isRecurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-4 h-4 text-[#2879D8] border-gray-300 rounded"
            />
            <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700">
              Herhalende afspraken (reeks)
            </label>
          </div>

          {isRecurring && (
            <div className="grid grid-cols-2 gap-4 pl-6 bg-blue-50 p-4 rounded">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aantal sessies *
                </label>
                <input
                  type="number"
                  min="2"
                  max="52"
                  value={totaalSessies}
                  onChange={(e) => setTotaalSessies(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequentie *
                </label>
                <select
                  value={frequentie}
                  onChange={(e) => setFrequentie(e.target.value as Frequentie)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="WEKELIJKS">Wekelijks</option>
                  <option value="TWEEMAAL_PER_WEEK">Tweemaal per week</option>
                  <option value="MAANDELIJKS">Maandelijks</option>
                </select>
              </div>
              <div className="col-span-2 text-sm text-gray-600">
                Dit zal {totaalSessies} afspraken aanmaken vanaf de gekozen startdatum.
              </div>
            </div>
          )}
        </div>

        {/* Planned Dates Preview */}
        {plannedDates.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <p className="font-medium text-blue-800 mb-2">Geplande datums:</p>
            <div className="grid grid-cols-3 gap-2 text-sm text-blue-700">
              {plannedDates.map((date, index) => (
                <div key={index}>
                  {index + 1}. {new Date(date).toLocaleDateString('nl-BE')}
                </div>
              ))}
            </div>
          </div>
        )}

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
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || !selectedPatient}
            className="flex-1 py-2 px-4 bg-[#2879D8] text-white rounded-md hover:bg-[#1e60b0] disabled:opacity-50"
          >
            {loading ? 'Inplannen...' : 'Afspraak Inplannen'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuleren
          </button>
        </div>
      </form>
    </div>
  );
}
