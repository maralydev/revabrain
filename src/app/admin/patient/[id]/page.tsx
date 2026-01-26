'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getPatientById } from '@/modules/patient/queries';
import { exportPatientData } from '@/modules/patient/export';
import { deletePatient } from '@/modules/patient/delete';
import type { Patient } from '@prisma/client';

export default function PatientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = Number(params.id);

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteReden, setDeleteReden] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadPatient();
  }, [patientId]);

  async function loadPatient() {
    try {
      setLoading(true);
      const data = await getPatientById(patientId);
      setPatient(data);
    } catch (err) {
      setError('Fout bij laden patiënt');
    } finally {
      setLoading(false);
    }
  }

  async function handleExport() {
    if (!patient) return;

    try {
      setExporting(true);
      setError('');

      const result = await exportPatientData(patientId);

      if (result.success && result.data) {
        // Download JSON file
        const dataStr = JSON.stringify(result.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `patient_${patient.achternaam}_${patient.voornaam}_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        setError(result.error || 'Fout bij exporteren');
      }
    } catch (err) {
      setError('Er is een fout opgetreden');
    } finally {
      setExporting(false);
    }
  }

  async function handleDelete() {
    if (!patient || !deleteReden) return;

    try {
      setDeleting(true);
      setError('');

      const result = await deletePatient({
        patientId,
        reden: deleteReden,
      });

      if (result.success) {
        alert('Patiënt permanent verwijderd. Alle persoonsgegevens zijn gewist.');
        router.push('/admin/patient');
        router.refresh();
      } else {
        setError(result.error || 'Fout bij verwijderen');
      }
    } catch (err) {
      setError('Er is een fout opgetreden');
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
      setDeleteReden('');
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-gray-600">Laden...</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-red-600">Patiënt niet gevonden</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#2879D8' }}>
          {patient.voornaam} {patient.achternaam}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {exporting ? 'Exporteren...' : 'Exporteer Data (GDPR)'}
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Verwijder (GDPR)
          </button>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Terug
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Voornaam</div>
            <div className="font-medium">{patient.voornaam}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Achternaam</div>
            <div className="font-medium">{patient.achternaam}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Geboortedatum</div>
            <div className="font-medium">
              {new Date(patient.geboortedatum).toLocaleDateString('nl-BE')}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Telefoon</div>
            <div className="font-medium">{patient.telefoonnummer}</div>
          </div>
          {patient.email && (
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="font-medium">{patient.email}</div>
            </div>
          )}
          {patient.straat && (
            <div className="col-span-2">
              <div className="text-sm text-gray-500">Adres</div>
              <div className="font-medium">
                {patient.straat} {patient.huisnummer}, {patient.postcode} {patient.gemeente}
              </div>
            </div>
          )}
          {patient.contactpersoon && (
            <>
              <div>
                <div className="text-sm text-gray-500">Contactpersoon</div>
                <div className="font-medium">{patient.contactpersoon}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Contactpersoon telefoon</div>
                <div className="font-medium">{patient.contactpersoonTelefoon}</div>
              </div>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Aangemaakt: {new Date(patient.aangemaakt).toLocaleString('nl-BE')}
          </div>
          <div className="text-sm text-gray-500">
            Laatst gewijzigd: {new Date(patient.laatstGewijzigd).toLocaleString('nl-BE')}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded p-4">
        <h2 className="font-semibold text-blue-900 mb-2">GDPR Export</h2>
        <p className="text-sm text-blue-800">
          De export bevat alle persoonsgegevens, afspraakhistorie en notities van deze patiënt in JSON formaat.
          Deze export kan gebruikt worden voor inzageverzoeken conform GDPR.
        </p>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Patiënt Permanent Verwijderen (GDPR)
            </h2>
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
              <p className="text-sm text-red-800 font-semibold mb-2">
                WAARSCHUWING: Deze actie kan niet ongedaan gemaakt worden!
              </p>
              <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                <li>Alle persoonsgegevens worden permanent verwijderd</li>
                <li>Afspraken worden geanonimiseerd (naam verwijderd)</li>
                <li>Herhalende reeksen worden verwijderd</li>
              </ul>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reden voor verwijdering (verplicht) *
              </label>
              <textarea
                value={deleteReden}
                onChange={(e) => setDeleteReden(e.target.value)}
                rows={3}
                placeholder="Bijv: GDPR verzoek van patiënt d.d. ..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting || deleteReden.length < 5}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Verwijderen...' : 'Bevestig Verwijdering'}
              </button>
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setDeleteReden('');
                }}
                disabled={deleting}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
