'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllDisciplineConfigs } from '@/modules/discipline-config/queries';
import { updateDisciplineConfig, type UpdateDisciplineConfigInput } from '@/modules/discipline-config/actions';
import { getAllTeamleden } from '@/modules/teamlid/queries';
import type { DisciplineConfigData } from '@/modules/discipline-config/queries';
import type { Teamlid } from '@prisma/client';

const disciplineIcons: Record<string, string> = {
  LOGOPEDIE: '🗣️',
  KINESITHERAPIE: '🏃',
  ERGOTHERAPIE: '🏗️',
  NEUROPSYCHOLOGIE: '🧠',
  DIETIEK: '🥗',
};

const disciplineColors: Record<string, { bg: string; border: string; text: string; lightBg: string }> = {
  LOGOPEDIE: { bg: 'bg-blue-500', border: 'border-blue-200', text: 'text-blue-700', lightBg: 'bg-blue-50' },
  KINESITHERAPIE: { bg: 'bg-emerald-500', border: 'border-emerald-200', text: 'text-emerald-700', lightBg: 'bg-emerald-50' },
  ERGOTHERAPIE: { bg: 'bg-purple-500', border: 'border-purple-200', text: 'text-purple-700', lightBg: 'bg-purple-50' },
  NEUROPSYCHOLOGIE: { bg: 'bg-amber-500', border: 'border-amber-200', text: 'text-amber-700', lightBg: 'bg-amber-50' },
  DIETIEK: { bg: 'bg-rose-500', border: 'border-rose-200', text: 'text-rose-700', lightBg: 'bg-rose-50' },
};

export default function DisciplinesPage() {
  const router = useRouter();
  const [configs, setConfigs] = useState<DisciplineConfigData[]>([]);
  const [teamleden, setTeamleden] = useState<Teamlid[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [naam, setNaam] = useState('');
  const [beschrijving, setBeschrijving] = useState('');
  const [actief, setActief] = useState(true);
  const [volgorde, setVolgorde] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [configsData, teamledenData] = await Promise.all([
        getAllDisciplineConfigs(),
        getAllTeamleden(),
      ]);
      setConfigs(configsData);
      setTeamleden(teamledenData);
    } catch (err) {
      setError('Fout bij laden configuraties');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEditingCode(null);
    setNaam('');
    setBeschrijving('');
    setActief(true);
    setVolgorde(0);
    setError('');
    setSuccess('');
  }

  function handleEdit(config: DisciplineConfigData) {
    setEditingCode(config.code);
    setNaam(config.naam);
    setBeschrijving(config.beschrijving || '');
    setActief(config.actief);
    setVolgorde(config.volgorde);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      if (!editingCode) {
        setError('Geen discipline geselecteerd');
        setSaving(false);
        return;
      }

      if (!naam) {
        setError('Naam is verplicht');
        setSaving(false);
        return;
      }

      const input: UpdateDisciplineConfigInput = {
        code: editingCode,
        naam,
        beschrijving,
        actief,
        volgorde,
      };

      const result = await updateDisciplineConfig(input);

      if (result.success) {
        setSuccess('Configuratie bijgewerkt');
        setShowForm(false);
        resetForm();
        loadData();
      } else {
        setError(result.error || 'Fout bij wijzigen');
      }
    } catch (err) {
      setError('Er is een fout opgetreden');
    } finally {
      setSaving(false);
    }
  }

  // Count teamleden per discipline
  function getTeamledenCount(disciplineCode: string): number {
    return teamleden.filter(t => t.discipline === disciplineCode && t.actief).length;
  }

  // Get teamleden names for discipline
  function getTeamledenNamen(disciplineCode: string): string {
    const teamledenInDiscipline = teamleden.filter(
      t => t.discipline === disciplineCode && t.actief
    );
    return teamledenInDiscipline
      .map(t => `${t.voornaam} ${t.achternaam}`)
      .join(', ') || 'Geen';
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
            Disciplines
          </h1>
          <p className="text-gray-500 mt-1">
            Configureer disciplines en hun weergave
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-[var(--rb-light)] border border-[var(--rb-primary)]/10 rounded-xl flex items-start gap-3">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
          <InfoIcon className="w-5 h-5 text-[var(--rb-primary)]" />
        </div>
        <p className="text-sm text-[var(--rb-primary)]">
          <strong>Let op:</strong> Disciplines zijn gekoppeld aan de code (LOGOPEDIE, KINESITHERAPIE, etc.).
          Je kunt de weergavenaam, beschrijving en volgorde wijzigen. Teamleden kunnen gekoppeld worden
          aan een discipline via Team Beheren.
        </p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <CheckIcon className="w-5 h-5" />
          </div>
          <span className="font-medium">{success}</span>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="mb-8 bg-white rounded-2xl shadow-[var(--shadow-card)] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="px-2.5 py-1 bg-gray-200 rounded-lg font-mono text-xs">{editingCode}</span>
              Configuratie Wijzigen
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Weergavenaam <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={naam}
                onChange={(e) => setNaam(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:border-[var(--rb-primary)] focus:bg-white transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Beschrijving <span className="text-gray-400 font-normal">(voor publieke website)</span>
              </label>
              <textarea
                value={beschrijving}
                onChange={(e) => setBeschrijving(e.target.value)}
                rows={3}
                placeholder="Korte beschrijving van deze discipline voor op de website..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:border-[var(--rb-primary)] focus:bg-white transition-all duration-200 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Volgorde
                </label>
                <input
                  type="number"
                  value={volgorde}
                  onChange={(e) => setVolgorde(Number(e.target.value))}
                  min={0}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:border-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                />
                <p className="text-xs text-gray-500 mt-2">Volgorde waarin disciplines getoond worden</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <label className="flex items-center gap-3 h-[50px] cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="actief"
                      checked={actief}
                      onChange={(e) => setActief(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[var(--rb-primary)] transition-colors" />
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm peer-checked:translate-x-5 transition-transform" />
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                    Actief (zichtbaar voor nieuwe teamleden)
                  </span>
                </label>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
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
                    Opslaan...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-5 h-5" />
                    Wijzigingen Opslaan
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                disabled={saving}
                className="px-6 py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-all duration-200"
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
            Geconfigureerde Disciplines
          </h2>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-3 border-[var(--rb-primary)] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 font-medium mt-4">Laden...</p>
          </div>
        ) : configs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
              <FolderIcon className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium text-lg">Geen disciplines gevonden</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {configs.map((config) => {
              const colors = disciplineColors[config.code] || disciplineColors.LOGOPEDIE;
              const icon = disciplineIcons[config.code] || '📋';
              
              return (
                <div key={config.id} className="p-5 hover:bg-gray-50/50 transition-colors duration-150 group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-2xl">{icon}</span>
                        <span className="font-semibold text-gray-900 text-lg">
                          {config.naam}
                        </span>
                        <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg font-mono">
                          {config.code}
                        </span>
                        {!config.actief && (
                          <span className="text-xs px-2.5 py-1 bg-red-50 text-red-700 rounded-lg font-semibold border border-red-100">
                            Inactief
                          </span>
                        )}
                        <span className="text-xs px-2.5 py-1 bg-[var(--rb-light)] text-[var(--rb-primary)] rounded-lg font-semibold">
                          Volgorde: {config.volgorde}
                        </span>
                      </div>
                      {config.beschrijving && (
                        <p className="text-sm text-gray-600 mt-2">{config.beschrijving}</p>
                      )}
                      <div className="text-sm text-gray-500 mt-3 flex items-center gap-2">
                        <UsersIcon className="w-4 h-4" />
                        <strong>{getTeamledenCount(config.code)} teamleden:</strong>
                        <span className="text-gray-400">{getTeamledenNamen(config.code)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEdit(config)}
                      className="px-4 py-2 text-sm font-semibold text-[var(--rb-primary)] hover:text-[var(--rb-primary-dark)] hover:bg-[var(--rb-light)] rounded-xl transition-all duration-200 flex items-center gap-2 opacity-0 group-hover:opacity-100"
                    >
                      <EditIcon className="w-4 h-4" />
                      Bewerken
                    </button>
                  </div>
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
function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}
