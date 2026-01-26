'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllAfspraakTypeConfigs } from '@/modules/afspraak-type-config/queries';
import { updateAfspraakTypeConfig, type UpdateAfspraakTypeConfigInput } from '@/modules/afspraak-type-config/actions';
import type { AfspraakTypeConfigData } from '@/modules/afspraak-type-config/queries';

export default function AfspraakTypesPage() {
  const router = useRouter();
  const [configs, setConfigs] = useState<AfspraakTypeConfigData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [naam, setNaam] = useState('');
  const [kleur, setKleur] = useState('');
  const [standaardDuur, setStandaardDuur] = useState(45);
  const [factureerbaar, setFactureerbaar] = useState(true);
  const [actief, setActief] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadConfigs();
  }, []);

  async function loadConfigs() {
    try {
      setLoading(true);
      const data = await getAllAfspraakTypeConfigs();
      setConfigs(data);
    } catch (err) {
      setError('Fout bij laden configuraties');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEditingCode(null);
    setNaam('');
    setKleur('');
    setStandaardDuur(45);
    setFactureerbaar(true);
    setActief(true);
    setError('');
    setSuccess('');
  }

  function handleEdit(config: AfspraakTypeConfigData) {
    setEditingCode(config.code);
    setNaam(config.naam);
    setKleur(config.kleur);
    setStandaardDuur(config.standaardDuur);
    setFactureerbaar(config.factureerbaar);
    setActief(config.actief);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      if (!editingCode) {
        setError('Geen type geselecteerd');
        setSaving(false);
        return;
      }

      if (!naam || !kleur || !standaardDuur) {
        setError('Verplichte velden ontbreken');
        setSaving(false);
        return;
      }

      const input: UpdateAfspraakTypeConfigInput = {
        code: editingCode,
        naam,
        kleur,
        standaardDuur,
        factureerbaar,
        actief,
      };

      const result = await updateAfspraakTypeConfig(input);

      if (result.success) {
        setSuccess('Configuratie bijgewerkt');
        setShowForm(false);
        resetForm();
        loadConfigs();
      } else {
        setError(result.error || 'Fout bij wijzigen');
      }
    } catch (err) {
      setError('Er is een fout opgetreden');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#2879D8' }}>
          Afspraak Types Beheren
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
          <strong>Let op:</strong> Afspraak types zijn gekoppeld aan de code (INTAKE, CONSULTATIE, etc.).
          Je kunt de weergavenaam, kleur, standaard duur en facturatie-instellingen wijzigen, maar geen nieuwe types aanmaken
          (dit vereist code-wijzigingen).
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kleur (hex) *
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={kleur}
                  onChange={(e) => setKleur(e.target.value)}
                  className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={kleur}
                  onChange={(e) => setKleur(e.target.value)}
                  placeholder="#3B82F6"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  required
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Standaard Duur (minuten) *
              </label>
              <select
                value={standaardDuur}
                onChange={(e) => setStandaardDuur(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
                <option value={90}>90 min</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="factureerbaar"
                checked={factureerbaar}
                onChange={(e) => setFactureerbaar(e.target.checked)}
                className="w-4 h-4 text-[#2879D8] border-gray-300 rounded"
              />
              <label htmlFor="factureerbaar" className="text-sm text-gray-700">
                Factureerbaar
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="actief"
                checked={actief}
                onChange={(e) => setActief(e.target.checked)}
                className="w-4 h-4 text-[#2879D8] border-gray-300 rounded"
              />
              <label htmlFor="actief" className="text-sm text-gray-700">
                Actief
              </label>
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
          <div className="p-6 text-gray-500">Geen afspraak types gevonden</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {configs.map((config) => (
              <div key={config.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: config.kleur }}
                      title={config.kleur}
                    />
                    <div>
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
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Duur: {config.standaardDuur} min •
                        {config.factureerbaar ? ' Factureerbaar' : ' Niet factureerbaar'}
                      </div>
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
