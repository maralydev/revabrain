'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllPageContent, type PageContentData } from '@/modules/page-content/queries';
import { savePageContent, deletePageContent, togglePublished, seedPageContentStructure } from '@/modules/page-content/actions';

const PAGES = ['home', 'team', 'treatments', 'costs', 'contact', 'verwijzers'];
const LOCALES = [
  { code: 'nl', name: 'Nederlands' },
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
];

const PAGE_LABELS: Record<string, string> = {
  home: 'Homepage',
  team: 'Team',
  treatments: 'Behandelingen',
  costs: 'Tarieven',
  contact: 'Contact',
  verwijzers: 'Voor Verwijzers',
};

export default function ContentManagementPage() {
  const [content, setContent] = useState<PageContentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [selectedLocale, setSelectedLocale] = useState<string>('nl');
  const [editItem, setEditItem] = useState<PageContentData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [formSection, setFormSection] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formContent2, setFormContent2] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formButtonText, setFormButtonText] = useState('');
  const [formButtonUrl, setFormButtonUrl] = useState('');
  const [formPublished, setFormPublished] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    setLoading(true);
    const data = await getAllPageContent();
    setContent(data);
    setLoading(false);
  }

  function resetForm() {
    setFormSection('');
    setFormTitle('');
    setFormSubtitle('');
    setFormContent('');
    setFormContent2('');
    setFormImageUrl('');
    setFormButtonText('');
    setFormButtonUrl('');
    setFormPublished(false);
    setEditItem(null);
    setIsCreating(false);
  }

  function startEdit(item: PageContentData) {
    setEditItem(item);
    setFormSection(item.section);
    setFormTitle(item.title || '');
    setFormSubtitle(item.subtitle || '');
    setFormContent(item.content || '');
    setFormContent2(item.content2 || '');
    setFormImageUrl(item.imageUrl || '');
    setFormButtonText(item.buttonText || '');
    setFormButtonUrl(item.buttonUrl || '');
    setFormPublished(item.published);
    setIsCreating(false);
  }

  function startCreate() {
    resetForm();
    setIsCreating(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const result = await savePageContent({
      page: editItem?.page || selectedPage,
      section: formSection,
      locale: editItem?.locale || selectedLocale,
      title: formTitle || undefined,
      subtitle: formSubtitle || undefined,
      content: formContent || undefined,
      content2: formContent2 || undefined,
      imageUrl: formImageUrl || undefined,
      buttonText: formButtonText || undefined,
      buttonUrl: formButtonUrl || undefined,
      published: formPublished,
    });

    if (result.success) {
      setMessage({ type: 'success', text: 'Content opgeslagen!' });
      await loadContent();
      resetForm();
    } else {
      setMessage({ type: 'error', text: result.error || 'Opslaan mislukt' });
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Weet je zeker dat je dit item wilt verwijderen?')) return;

    const result = await deletePageContent(id);
    if (result.success) {
      setMessage({ type: 'success', text: 'Content verwijderd!' });
      await loadContent();
      resetForm();
    } else {
      setMessage({ type: 'error', text: result.error || 'Verwijderen mislukt' });
    }
  }

  async function handleTogglePublished(id: number) {
    const result = await togglePublished(id);
    if (result.success) {
      await loadContent();
    }
  }

  async function handleSeedContent() {
    if (!confirm('Wil je de standaard content structuur aanmaken?')) return;

    const result = await seedPageContentStructure();
    if (result.success) {
      setMessage({ type: 'success', text: `${result.created} items aangemaakt` });
      await loadContent();
    }
  }

  // Filter content for current page and locale
  const filteredContent = content.filter(
    (c) => c.page === selectedPage && c.locale === selectedLocale
  );

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
              ← Terug
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Content Beheer (CMS)</h1>
          </div>
          <button
            onClick={handleSeedContent}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Seed Structuur
          </button>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Pagina</label>
              <select
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
                className="px-3 py-2 border rounded"
              >
                {PAGES.map((p) => (
                  <option key={p} value={p}>
                    {PAGE_LABELS[p] || p}
                  </option>
                ))}
              </select>
            </div>
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
                + Nieuwe Sectie
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Content List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">
                {PAGE_LABELS[selectedPage]} - {LOCALES.find((l) => l.code === selectedLocale)?.name}
              </h2>
            </div>
            <div className="divide-y">
              {filteredContent.length === 0 ? (
                <p className="p-4 text-gray-500 text-center">
                  Geen content gevonden. Klik &quot;Seed Structuur&quot; om te beginnen.
                </p>
              ) : (
                filteredContent.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      editItem?.id === item.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => startEdit(item)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {item.section}
                        </span>
                        {item.title && (
                          <span className="ml-2 text-gray-700">{item.title}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePublished(item.id);
                          }}
                          className={`px-2 py-1 text-xs rounded ${
                            item.published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {item.published ? 'Gepubliceerd' : 'Draft'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Verwijder
                        </button>
                      </div>
                    </div>
                    {item.content && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {item.content}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Edit Form */}
          {(editItem || isCreating) && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {isCreating ? 'Nieuwe Sectie' : 'Bewerken'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Annuleren
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sectie ID *
                  </label>
                  <input
                    type="text"
                    value={formSection}
                    onChange={(e) => setFormSection(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="bijv. hero, vision, intro"
                    required
                    disabled={!!editItem}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titel
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Sectie titel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ondertitel
                  </label>
                  <input
                    type="text"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Optionele ondertitel/label"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inhoud
                  </label>
                  <textarea
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    className="w-full px-3 py-2 border rounded h-32"
                    placeholder="Tekst content..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inhoud 2 (tweede alinea)
                  </label>
                  <textarea
                    value={formContent2}
                    onChange={(e) => setFormContent2(e.target.value)}
                    className="w-full px-3 py-2 border rounded h-32"
                    placeholder="Optionele tweede alinea..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Afbeelding URL
                  </label>
                  <input
                    type="url"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="/images/... of https://..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Button Tekst
                    </label>
                    <input
                      type="text"
                      value={formButtonText}
                      onChange={(e) => setFormButtonText(e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                      placeholder="Neem contact op"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Button URL
                    </label>
                    <input
                      type="text"
                      value={formButtonUrl}
                      onChange={(e) => setFormButtonUrl(e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                      placeholder="/contact"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formPublished}
                    onChange={(e) => setFormPublished(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="published" className="text-sm text-gray-700">
                    Gepubliceerd (zichtbaar op website)
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Opslaan
                  </button>
                  {editItem && (
                    <Link
                      href={`/${selectedPage}?preview=true`}
                      target="_blank"
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-center"
                    >
                      Preview
                    </Link>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Help text when no form */}
          {!editItem && !isCreating && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Instructies</h2>
              <div className="text-sm text-gray-600 space-y-3">
                <p>
                  Met het CMS kan je website content bewerken zonder code aan te passen.
                </p>
                <p>
                  <strong>Hoe te gebruiken:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Selecteer een pagina en taal</li>
                  <li>Klik op een sectie om te bewerken</li>
                  <li>Pas titel en/of inhoud aan</li>
                  <li>Zet op &quot;Gepubliceerd&quot; om zichtbaar te maken</li>
                  <li>Klik &quot;Opslaan&quot;</li>
                </ol>
                <p className="mt-4">
                  <strong>Secties:</strong> Elke pagina heeft voorgedefinieerde secties
                  (hero, vision, etc.). De content uit het CMS overschrijft de
                  standaard teksten als deze gepubliceerd is.
                </p>
                <p>
                  <strong>Afbeeldingen:</strong> Voer een URL in naar een afbeelding
                  (bijv. gehost op Cloudinary of Imgur).
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
