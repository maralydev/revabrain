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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[var(--rb-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Laden...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-slate-600 font-medium">Patiënt niet gevonden</p>
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[var(--rb-primary)] to-[var(--rb-accent)] rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[var(--rb-primary)]/25">
              {patient.voornaam.charAt(0)}{patient.achternaam.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                {patient.voornaam} {patient.achternaam}
              </h1>
              <p className="text-slate-500 mt-1">Patiënt details</p>
            </div>
          </div>
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

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Patient Info Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Persoonsgegevens</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-slate-500 mb-1">Voornaam</div>
                <div className="font-semibold text-slate-800">{patient.voornaam}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1">Achternaam</div>
                <div className="font-semibold text-slate-800">{patient.achternaam}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1">Geboortedatum</div>
                <div className="font-semibold text-slate-800">
                  {new Date(patient.geboortedatum).toLocaleDateString('nl-BE')}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1">Telefoonnummer</div>
                <div className="font-semibold text-slate-800">{patient.telefoonnummer}</div>
              </div>
              {patient.email && (
                <div className="col-span-2">
                  <div className="text-sm text-slate-500 mb-1">Email</div>
                  <div className="font-semibold text-slate-800">{patient.email}</div>
                </div>
              )}
              {patient.straat && (
                <div className="col-span-2">
                  <div className="text-sm text-slate-500 mb-1">Adres</div>
                  <div className="font-semibold text-slate-800">
                    {patient.straat} {patient.huisnummer}, {patient.postcode} {patient.gemeente}
                  </div>
                </div>
              )}
              {patient.contactpersoon && (
                <>
                  <div>
                    <div className="text-sm text-slate-500 mb-1">Contactpersoon</div>
                    <div className="font-semibold text-slate-800">{patient.contactpersoon}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 mb-1">Contactpersoon telefoon</div>
                    <div className="font-semibold text-slate-800">{patient.contactpersoonTelefoon}</div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100">
            <div className="flex gap-6 text-sm text-slate-500">
              <span>Aangemaakt: {new Date(patient.aangemaakt).toLocaleString('nl-BE')}</span>
              <span>Laatst gewijzigd: {new Date(patient.laatstGewijzigd).toLocaleString('nl-BE')}</span>
            </div>
          </div>
        </div>

        {/* GDPR Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4 text-[var(--rb-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              GDPR Acties
            </h2>
          </div>

          {/* Export Info */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 mb-1">Data Export</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Exporteer alle persoonsgegevens, afspraakhistorie en notities van deze patiënt in JSON formaat.
                  Deze export kan gebruikt worden voor inzageverzoeken conform GDPR.
                </p>
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="
                    px-5 py-2.5
                    bg-gradient-to-r from-emerald-500 to-emerald-600
                    text-white font-semibold rounded-xl
                    shadow-lg shadow-emerald-500/25
                    hover:shadow-xl hover:shadow-emerald-500/30
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                    flex items-center gap-2
                  "
                >
                  {exporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Exporteren...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Exporteer Data
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Delete Section */}
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 mb-1">Recht op Vergetelheid</h3>
                <p className="text-sm text-slate-600 mb-3">
                  Verwijder alle persoonsgegevens van deze patiënt permanent. Afspraken worden geanonimiseerd
                  voor statistische doeleinden. Deze actie kan niet ongedaan gemaakt worden.
                </p>
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="
                    px-5 py-2.5
                    bg-gradient-to-r from-red-500 to-red-600
                    text-white font-semibold rounded-xl
                    shadow-lg shadow-red-500/25
                    hover:shadow-xl hover:shadow-red-500/30
                    transition-all duration-200
                    flex items-center gap-2
                  "
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Verwijder Patiënt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  Patiënt Permanent Verwijderen
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Deze actie kan niet ongedaan gemaakt worden!
                </p>
                <ul className="text-sm text-red-700 space-y-1 ml-6">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                    Alle persoonsgegevens worden permanent verwijderd
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                    Afspraken worden geanonimiseerd (naam verwijderd)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                    Herhalende reeksen worden verwijderd
                  </li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Reden voor verwijdering <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={deleteReden}
                  onChange={(e) => setDeleteReden(e.target.value)}
                  rows={3}
                  placeholder="Bijv: GDPR verzoek van patiënt d.d. ..."
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all duration-200 resize-none"
                />
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting || deleteReden.length < 5}
                className="
                  flex-1 py-3 px-4
                  bg-gradient-to-r from-red-500 to-red-600
                  text-white font-semibold rounded-xl
                  shadow-lg shadow-red-500/25
                  hover:shadow-xl hover:shadow-red-500/30
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                  flex items-center justify-center gap-2
                "
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verwijderen...
                  </>
                ) : (
                  'Bevestig Verwijdering'
                )}
              </button>
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setDeleteReden('');
                }}
                disabled={deleting}
                className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-100 disabled:opacity-50 transition-all duration-200"
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
