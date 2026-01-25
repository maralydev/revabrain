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
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#2879D8' }}>
          Disciplines Beheren
        </h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Terug
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-6">
        <p className="text-sm">
          <strong>Let op:</strong> Disciplines zijn gekoppeld aan de code (LOGOPEDIE, KINESITHERAPIE, etc.).
          Je kunt de weergavenaam, beschrijving en volgorde wijzigen. Teamleden kunnen gekoppeld worden
          aan een discipline via Team Beheren.
        </p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {editingCode} - Configuratie Wijzigen
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weergavenaam *
            </label>
            <input
              type="text"
              value={naam}
              onChange={(e) => setNaam(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beschrijving (voor publieke website)
            </label>
            <textarea
              value={beschrijving}
              onChange={(e) => setBeschrijving(e.target.value)}
              rows={3}
              placeholder="Korte beschrijving van deze discipline voor op de website..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Volgorde
              </label>
              <input
                type="number"
                value={volgorde}
                onChange={(e) => setVolgorde(Number(e.target.value))}
                min={0}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <p className="text-xs text-gray-500 mt-1">Volgorde waarin disciplines getoond worden</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex items-center gap-2 h-10">
                <input
                  type="checkbox"
                  id="actief"
                  checked={actief}
                  onChange={(e) => setActief(e.target.checked)}
                  className="w-4 h-4 text-[#2879D8] border-gray-300 rounded"
                />
                <label htmlFor="actief" className="text-sm text-gray-700">
                  Actief (zichtbaar voor nieuwe teamleden)
                </label>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 px-4 bg-[#2879D8] text-white rounded-md hover:bg-[#1e60b0] disabled:opacity-50"
            >
              {saving ? 'Opslaan...' : 'Wijzigingen Opslaan'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              disabled={saving}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Annuleren
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-6 text-gray-600">Laden...</div>
        ) : configs.length === 0 ? (
          <div className="p-6 text-gray-500">Geen disciplines gevonden</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {configs.map((config) => (
              <div key={config.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">
                        {config.naam}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-mono">
                        {config.code}
                      </span>
                      {!config.actief && (
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded">
                          Inactief
                        </span>
                      )}
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                        Volgorde: {config.volgorde}
                      </span>
                    </div>
                    {config.beschrijving && (
                      <p className="text-sm text-gray-600 mt-2">{config.beschrijving}</p>
                    )}
                    <div className="text-sm text-gray-500 mt-2">
                      <strong>Teamleden ({getTeamledenCount(config.code)}):</strong>{' '}
                      {getTeamledenNamen(config.code)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit(config)}
                    className="text-blue-600 hover:text-blue-800 px-3 py-1"
                  >
                    Bewerken
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
