'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllBehandelingenAdmin, type BehandelingData, type AandoeningData } from '@/modules/behandeling/queries';
import {
  saveBehandeling,
  updateBehandeling,
  deleteBehandeling,
  toggleBehandelingActief,
  createAandoening,
  updateAandoening,
  deleteAandoening,
} from '@/modules/behandeling/actions';

const LOCALES = [
  { code: 'nl', name: 'Nederlands' },
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
];

export default function BehandelingenAdminPage() {
  const [behandelingen, setBehandelingen] = useState<BehandelingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocale, setSelectedLocale] = useState('nl');
  const [editItem, setEditItem] = useState<BehandelingData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [formSlug, setFormSlug] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formLongDescription, setFormLongDescription] = useState('');
  const [formExtraInfo, setFormExtraInfo] = useState('');
  const [formColor, setFormColor] = useState('#2879D8');
  const [formVolgorde, setFormVolgorde] = useState(0);
  const [formActief, setFormActief] = useState(true);

  // Aandoening state
  const [showAandoeningForm, setShowAandoeningForm] = useState(false);
  const [editAandoening, setEditAandoening] = useState<AandoeningData | null>(null);
  const [aandoeningNaam, setAandoeningNaam] = useState('');
  const [aandoeningBeschrijving, setAandoeningBeschrijving] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await getAllBehandelingenAdmin();
    setBehandelingen(data);
    setLoading(false);
  }

  function resetForm() {
    setFormSlug('');
    setFormTitle('');
    setFormDescription('');
    setFormLongDescription('');
    setFormExtraInfo('');
    setFormColor('#2879D8');
    setFormVolgorde(0);
    setFormActief(true);
    setEditItem(null);
    setIsCreating(false);
    setShowAandoeningForm(false);
    setEditAandoening(null);
  }

  function startEdit(item: BehandelingData) {
    setEditItem(item);
    setFormSlug(item.slug);
    setFormTitle(item.title);
    setFormDescription(item.description);
    setFormLongDescription(item.longDescription || '');
    setFormExtraInfo(item.extraInfo || '');
    setFormColor(item.color || '#2879D8');
    setFormVolgorde(item.volgorde);
    setFormActief(item.actief);
    setIsCreating(false);
    setShowAandoeningForm(false);
    setEditAandoening(null);
  }

  function startCreate() {
    resetForm();
    setIsCreating(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const result = await saveBehandeling({
      slug: formSlug,
      locale: selectedLocale,
      title: formTitle,
      description: formDescription,
      longDescription: formLongDescription || undefined,
      extraInfo: formExtraInfo || undefined,
      color: formColor || undefined,
      volgorde: formVolgorde,
      actief: formActief,
    });

    if (result.success) {
      setMessage({ type: 'success', text: 'Behandeling opgeslagen!' });
      await loadData();
      if (isCreating) {
        // Switch to edit mode for the new item
        const newItem = (await getAllBehandelingenAdmin()).find(
          (b) => b.slug === formSlug && b.locale === selectedLocale
        );
        if (newItem) {
          startEdit(newItem);
        } else {
          resetForm();
        }
      }
    } else {
      setMessage({ type: 'error', text: result.error || 'Opslaan mislukt' });
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Weet je zeker dat je deze behandeling wilt verwijderen? Dit verwijdert ook alle aandoeningen.')) return;

    const result = await deleteBehandeling(id);
    if (result.success) {
      setMessage({ type: 'success', text: 'Behandeling verwijderd!' });
      await loadData();
      resetForm();
    } else {
      setMessage({ type: 'error', text: result.error || 'Verwijderen mislukt' });
    }
  }

  async function handleToggleActief(id: number) {
    const result = await toggleBehandelingActief(id);
    if (result.success) {
      await loadData();
    }
  }

  // Aandoening handlers
  function startAddAandoening() {
    setShowAandoeningForm(true);
    setEditAandoening(null);
    setAandoeningNaam('');
    setAandoeningBeschrijving('');
  }

  function startEditAandoening(a: AandoeningData) {
    setShowAandoeningForm(true);
    setEditAandoening(a);
    setAandoeningNaam(a.naam);
    setAandoeningBeschrijving(a.beschrijving || '');
  }

  async function handleSaveAandoening(e: React.FormEvent) {
    e.preventDefault();
    if (!editItem) return;

    if (editAandoening) {
      const result = await updateAandoening(editAandoening.id, {
        naam: aandoeningNaam,
        beschrijving: aandoeningBeschrijving || undefined,
      });
      if (result.success) {
        await loadData();
        const updated = (await getAllBehandelingenAdmin()).find((b) => b.id === editItem.id);
        if (updated) setEditItem(updated);
        setShowAandoeningForm(false);
      }
    } else {
      const result = await createAandoening({
        naam: aandoeningNaam,
        beschrijving: aandoeningBeschrijving || undefined,
        behandelingId: editItem.id,
        volgorde: (editItem.aandoeningen?.length || 0) + 1,
      });
      if (result.success) {
        await loadData();
        const updated = (await getAllBehandelingenAdmin()).find((b) => b.id === editItem.id);
        if (updated) setEditItem(updated);
        setAandoeningNaam('');
        setAandoeningBeschrijving('');
      }
    }
  }

  async function handleDeleteAandoening(id: number) {
    if (!confirm('Weet je zeker dat je deze aandoening wilt verwijderen?')) return;

    const result = await deleteAandoening(id);
    if (result.success) {
      await loadData();
      if (editItem) {
        const updated = (await getAllBehandelingenAdmin()).find((b) => b.id === editItem.id);
        if (updated) setEditItem(updated);
      }
    }
  }

  // Filter by locale
  const filteredBehandelingen = behandelingen.filter((b) => b.locale === selectedLocale);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <p className="text-gray-600">Laden...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/agenda" className="text-gray-500 hover:text-gray-700">
              &larr; Terug
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Behandelingen Beheer</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Taal</label>
              <select
                value={selectedLocale}
                onChange={(e) => setSelectedLocale(e.target.value)}
                className="px-3 py-2 border rounded"
              >
                {LOCALES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={startCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                + Nieuwe Behandeling
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">
                Behandelingen - {LOCALES.find((l) => l.code === selectedLocale)?.name}
              </h2>
            </div>
            <div className="divide-y">
              {filteredBehandelingen.length === 0 ? (
                <p className="p-4 text-gray-500 text-center">
                  Geen behandelingen gevonden. Voeg een nieuwe toe.
                </p>
              ) : (
                filteredBehandelingen.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      editItem?.id === item.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => startEdit(item)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: item.color || '#2879D8' }}
                        />
                        <div>
                          <span className="font-medium">{item.title}</span>
                          <span className="ml-2 text-sm text-gray-500">({item.slug})</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {item.aandoeningen?.length || 0} indicaties
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleActief(item.id);
                          }}
                          className={`px-2 py-1 text-xs rounded ${
                            item.actief
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {item.actief ? 'Actief' : 'Inactief'}
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Edit Form */}
          {(editItem || isCreating) && (
            <div className="space-y-6">
              {/* Behandeling form */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">
                    {isCreating ? 'Nieuwe Behandeling' : 'Bewerken'}
                  </h2>
                  <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                    Annuleren
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Slug *
                      </label>
                      <input
                        type="text"
                        value={formSlug}
                        onChange={(e) => setFormSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="neurologopedie"
                        required
                        disabled={!!editItem}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Titel *
                      </label>
                      <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        placeholder="Neurologopedie"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Korte beschrijving *
                    </label>
                    <textarea
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="w-full px-3 py-2 border rounded h-24"
                      placeholder="Korte beschrijving voor overzicht..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Uitgebreide beschrijving
                    </label>
                    <textarea
                      value={formLongDescription}
                      onChange={(e) => setFormLongDescription(e.target.value)}
                      className="w-full px-3 py-2 border rounded h-32"
                      placeholder="Gedetailleerde uitleg..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Extra info
                    </label>
                    <textarea
                      value={formExtraInfo}
                      onChange={(e) => setFormExtraInfo(e.target.value)}
                      className="w-full px-3 py-2 border rounded h-24"
                      placeholder="Wanneer hulp zoeken..."
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Kleur</label>
                      <input
                        type="color"
                        value={formColor}
                        onChange={(e) => setFormColor(e.target.value)}
                        className="w-full h-10 border rounded cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Volgorde</label>
                      <input
                        type="number"
                        value={formVolgorde}
                        onChange={(e) => setFormVolgorde(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border rounded"
                        min="0"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formActief}
                          onChange={(e) => setFormActief(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-700">Actief</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Opslaan
                    </button>
                    {editItem && (
                      <button
                        type="button"
                        onClick={() => handleDelete(editItem.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Verwijderen
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Aandoeningen section (only when editing) */}
              {editItem && (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      Indicaties / Aandoeningen ({editItem.aandoeningen?.length || 0})
                    </h3>
                    <button
                      onClick={startAddAandoening}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      + Toevoegen
                    </button>
                  </div>

                  {/* Aandoening form */}
                  {showAandoeningForm && (
                    <form onSubmit={handleSaveAandoening} className="mb-4 p-4 bg-gray-50 rounded">
                      <div className="grid gap-3">
                        <input
                          type="text"
                          value={aandoeningNaam}
                          onChange={(e) => setAandoeningNaam(e.target.value)}
                          placeholder="Naam (bijv. Afasie)"
                          className="w-full px-3 py-2 border rounded"
                          required
                        />
                        <textarea
                          value={aandoeningBeschrijving}
                          onChange={(e) => setAandoeningBeschrijving(e.target.value)}
                          placeholder="Beschrijving (optioneel)"
                          className="w-full px-3 py-2 border rounded h-16"
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                          >
                            {editAandoening ? 'Bijwerken' : 'Toevoegen'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAandoeningForm(false);
                              setEditAandoening(null);
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                          >
                            Annuleren
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* List */}
                  <div className="divide-y">
                    {editItem.aandoeningen?.length === 0 ? (
                      <p className="text-gray-500 text-sm py-4 text-center">
                        Nog geen indicaties toegevoegd.
                      </p>
                    ) : (
                      editItem.aandoeningen?.map((a) => (
                        <div key={a.id} className="py-3 flex items-center justify-between">
                          <div>
                            <span className="font-medium">{a.naam}</span>
                            {a.beschrijving && (
                              <p className="text-sm text-gray-500">{a.beschrijving}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditAandoening(a)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Bewerk
                            </button>
                            <button
                              onClick={() => handleDeleteAandoening(a.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Verwijder
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Help */}
          {!editItem && !isCreating && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Instructies</h2>
              <div className="text-sm text-gray-600 space-y-3">
                <p>
                  Beheer hier de behandelingen die op de website getoond worden.
                </p>
                <p>
                  <strong>Behandeling:</strong> Een hoofdcategorie zoals Neurologopedie of Prelogopedie.
                </p>
                <p>
                  <strong>Indicaties/Aandoeningen:</strong> Specifieke aandoeningen die onder een behandeling vallen (bijv. Afasie, Dysartrie).
                </p>
                <ol className="list-decimal list-inside space-y-2 mt-4">
                  <li>Maak eerst een behandeling aan</li>
                  <li>Voeg daarna indicaties toe</li>
                  <li>Zet &quot;Actief&quot; aan om op de website te tonen</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
