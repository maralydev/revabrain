'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllDisciplineConfigs } from '@/modules/discipline-config/queries';
import { updateDisciplineConfig, type UpdateDisciplineConfigInput } from '@/modules/discipline-config/actions';
import { getAllTeamleden } from '@/modules/teamlid/queries';
import type { DisciplineConfigData } from '@/modules/discipline-config/queries';
import type { Teamlid } from '@prisma/client';

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
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Disciplines Beheren
            </h1>
            <p className="text-slate-500 mt-1">
              Configureer disciplines en hun weergave
            </p>
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

        {/* Info Banner */}
        <div className="mb-6 p-4 bg-[var(--rb-primary)]/5 border border-[var(--rb-primary)]/10 rounded-xl flex items-start gap-3">
          <div className="w-8 h-8 bg-[var(--rb-primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-[var(--rb-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-[var(--rb-primary)]">
            <strong>Let op:</strong> Disciplines zijn gekoppeld aan de code (LOGOPEDIE, KINESITHERAPIE, etc.).
            Je kunt de weergavenaam, beschrijving en volgorde wijzigen. Teamleden kunnen gekoppeld worden
            aan een discipline via Team Beheren.
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-medium">{success}</span>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <span className="px-2 py-0.5 bg-slate-100 rounded-md font-mono text-xs">{editingCode}</span>
                Configuratie Wijzigen
              </h2>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Weergavenaam <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={naam}
                  onChange={(e) => setNaam(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Beschrijving <span className="text-slate-400 font-normal">(voor publieke website)</span>
                </label>
                <textarea
                  value={beschrijving}
                  onChange={(e) => setBeschrijving(e.target.value)}
                  rows={3}
                  placeholder="Korte beschrijving van deze discipline voor op de website..."
                  className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Volgorde
                  </label>
                  <input
                    type="number"
                    value={volgorde}
                    onChange={(e) => setVolgorde(Number(e.target.value))}
                    min={0}
                    className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                  />
                  <p className="text-xs text-slate-500 mt-2">Volgorde waarin disciplines getoond worden</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                      <div className="w-5 h-5 bg-slate-100 border-2 border-slate-200 rounded-md peer-checked:bg-[var(--rb-primary)] peer-checked:border-[var(--rb-primary)] transition-all duration-200" />
                      <svg className="absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
                      Actief (zichtbaar voor nieuwe teamleden)
                    </span>
                  </label>
                </div>
              </div>

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

            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-3">
              <button
                type="submit"
                disabled={saving}
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
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                disabled={saving}
                className="px-6 py-4 bg-white border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-all duration-200"
              >
                Annuleren
              </button>
            </div>
          </form>
        )}

        {/* List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
              Geconfigureerde Disciplines
            </h2>
          </div>

          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-3 border-[var(--rb-primary)] border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-500 font-medium mt-4">Laden...</p>
            </div>
          ) : configs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-slate-500 font-medium">Geen disciplines gevonden</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {configs.map((config) => (
                <div key={config.id} className="p-5 hover:bg-slate-50/50 transition-colors duration-150">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-semibold text-slate-800">
                          {config.naam}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg font-mono">
                          {config.code}
                        </span>
                        {!config.actief && (
                          <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-lg font-medium">
                            Inactief
                          </span>
                        )}
                        <span className="text-xs px-2 py-0.5 bg-[var(--rb-primary)]/10 text-[var(--rb-primary)] rounded-lg font-medium">
                          Volgorde: {config.volgorde}
                        </span>
                      </div>
                      {config.beschrijving && (
                        <p className="text-sm text-slate-600 mt-2">{config.beschrijving}</p>
                      )}
                      <div className="text-sm text-slate-500 mt-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <strong>{getTeamledenCount(config.code)} teamleden:</strong>
                        <span className="text-slate-400">{getTeamledenNamen(config.code)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEdit(config)}
                      className="px-4 py-2 text-sm font-medium text-[var(--rb-primary)] hover:text-[var(--rb-primary-dark)] hover:bg-[var(--rb-primary)]/5 rounded-lg transition-all duration-200 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Bewerken
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
