'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllPageContent, type PageContentData } from '@/modules/page-content/queries';
import { savePageContent, deletePageContent, togglePublished, seedPageContentStructure } from '@/modules/page-content/actions';

const PAGES = ['home', 'team', 'treatments', 'disciplines', 'costs', 'contact', 'verwijzers', 'privacy', 'footer'];
const LOCALES = [
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

const PAGE_LABELS: Record<string, string> = {
  home: 'Homepage',
  team: 'Team',
  treatments: 'Behandelingen',
  disciplines: 'Disciplines',
  costs: 'Tarieven',
  contact: 'Contact',
  verwijzers: 'Voor Verwijzers',
  privacy: 'Privacy Policy',
  footer: 'Footer',
};

const PAGE_ICONS: Record<string, string> = {
  home: '🏠',
  team: '👥',
  treatments: '💊',
  disciplines: '🎯',
  costs: '💶',
  contact: '📧',
  verwijzers: '🔗',
  privacy: '🔒',
  footer: '📄',
};

export default function ContentManagementPage() {
  const [content, setContent] = useState<PageContentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [selectedLocale, setSelectedLocale] = useState<string>('nl');
  const [editItem, setEditItem] = useState<PageContentData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

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
    setSaving(true);

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

    setSaving(false);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[var(--rb-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Content Beheer
            </h1>
            <p className="text-slate-500 mt-1">
              Beheer website teksten en content
            </p>
          </div>
          <button
            onClick={handleSeedContent}
            className="
              px-5 py-2.5 text-sm font-medium
              bg-slate-100 text-slate-600 rounded-xl
              hover:bg-slate-200 transition-all duration-200
            "
          >
            Seed Structuur
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`
              mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2
              ${message.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : 'bg-red-50 text-red-700 border border-red-100'
              }
            `}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${message.type === 'success' ? 'bg-emerald-100' : 'bg-red-100'}`}>
              {message.type === 'success' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        {/* Filters - Modern Tabs */}
        <div className="mb-8 space-y-4">
          {/* Page Tabs */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-sm border border-slate-100">
            <div className="flex flex-wrap gap-1">
              {PAGES.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPage(p)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${selectedPage === p
                      ? 'bg-gradient-to-r from-[var(--rb-primary)] to-[var(--rb-primary-dark)] text-white shadow-lg shadow-[var(--rb-primary)]/20'
                      : 'text-slate-600 hover:bg-slate-100'
                    }
                  `}
                >
                  <span>{PAGE_ICONS[p]}</span>
                  <span>{PAGE_LABELS[p]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language & Create Button */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl">
              {LOCALES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setSelectedLocale(l.code)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${selectedLocale === l.code
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                    }
                  `}
                >
                  <span>{l.flag}</span>
                  <span>{l.name}</span>
                </button>
              ))}
            </div>

            <button
              onClick={startCreate}
              className="
                flex items-center gap-2 px-5 py-2.5
                bg-gradient-to-r from-[var(--rb-primary)] to-[var(--rb-primary-dark)]
                text-white text-sm font-semibold rounded-xl
                shadow-lg shadow-[var(--rb-primary)]/25
                hover:shadow-xl hover:shadow-[var(--rb-primary)]/30 hover:scale-[1.02]
                transition-all duration-200
              "
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nieuwe Sectie
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Content List */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span>{PAGE_ICONS[selectedPage]}</span>
                {PAGE_LABELS[selectedPage]}
                <span className="text-slate-400">•</span>
                <span className="text-sm font-normal text-slate-500">
                  {LOCALES.find((l) => l.code === selectedLocale)?.name}
                </span>
              </h2>
            </div>
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-auto">
              {filteredContent.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 font-medium">Geen content gevonden</p>
                  <p className="text-sm text-slate-400 mt-1">Klik &quot;Seed Structuur&quot; om te beginnen</p>
                </div>
              ) : (
                filteredContent.map((item) => (
                  <div
                    key={item.id}
                    className={`
                      p-4 cursor-pointer transition-all duration-200
                      ${editItem?.id === item.id
                        ? 'bg-[var(--rb-primary)]/5 border-l-4 border-l-[var(--rb-primary)]'
                        : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                      }
                    `}
                    onClick={() => startEdit(item)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded-lg text-slate-600">
                            {item.section}
                          </span>
                          {item.title && (
                            <span className="text-slate-800 font-medium truncate">{item.title}</span>
                          )}
                        </div>
                        {item.content && (
                          <p className="text-sm text-slate-400 mt-2 line-clamp-1">
                            {item.content}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePublished(item.id);
                          }}
                          className={`
                            px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200
                            ${item.published
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }
                          `}
                        >
                          {item.published ? '● Live' : '○ Draft'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Edit Form */}
          {(editItem || isCreating) ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-[var(--rb-primary)] to-[var(--rb-accent)] flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">
                  {isCreating ? 'Nieuwe Sectie' : 'Bewerken'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[calc(600px-68px)] overflow-auto">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Sectie ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formSection}
                    onChange={(e) => setFormSection(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200 disabled:opacity-50"
                    placeholder="bijv. hero, vision, intro"
                    required
                    disabled={!!editItem}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Titel
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                    placeholder="Sectie titel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Ondertitel
                  </label>
                  <input
                    type="text"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                    placeholder="Optionele ondertitel/label"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Inhoud
                  </label>
                  <textarea
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200 resize-none h-28"
                    placeholder="Tekst content..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Inhoud 2 <span className="text-slate-400 font-normal">(tweede alinea)</span>
                  </label>
                  <textarea
                    value={formContent2}
                    onChange={(e) => setFormContent2(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200 resize-none h-28"
                    placeholder="Optionele tweede alinea..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Afbeelding URL
                  </label>
                  <input
                    type="url"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                    placeholder="/images/... of https://..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Button Tekst
                    </label>
                    <input
                      type="text"
                      value={formButtonText}
                      onChange={(e) => setFormButtonText(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                      placeholder="Neem contact op"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Button URL
                    </label>
                    <input
                      type="text"
                      value={formButtonUrl}
                      onChange={(e) => setFormButtonUrl(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border-0 rounded-xl focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all duration-200"
                      placeholder="/contact"
                    />
                  </div>
                </div>

                {/* Toggle */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formPublished}
                        onChange={(e) => setFormPublished(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-emerald-500 transition-colors" />
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm peer-checked:translate-x-5 transition-transform" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">Gepubliceerd (zichtbaar op website)</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="
                      flex-1 py-3.5 px-6
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
                        Opslaan
                      </>
                    )}
                  </button>
                  {editItem && (
                    <Link
                      href={`/${selectedPage}?preview=true`}
                      target="_blank"
                      className="
                        px-6 py-3.5 text-sm font-medium
                        bg-slate-100 text-slate-600 rounded-xl
                        hover:bg-slate-200 transition-all duration-200
                        flex items-center gap-2
                      "
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Preview
                    </Link>
                  )}
                </div>
              </form>
            </div>
          ) : (
            /* Help text when no form */
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-100 p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[var(--rb-primary)]/10 to-[var(--rb-accent)]/10 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-[var(--rb-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Content Beheer</h2>
                <p className="text-slate-500">
                  Beheer alle website teksten op één plek
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-8 h-8 bg-[var(--rb-primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--rb-primary)] font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">Selecteer een pagina en taal</p>
                    <p className="text-slate-500 mt-0.5">Gebruik de tabs bovenaan om te navigeren</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-8 h-8 bg-[var(--rb-primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--rb-primary)] font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">Klik op een sectie om te bewerken</p>
                    <p className="text-slate-500 mt-0.5">Of maak een nieuwe sectie aan</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-8 h-8 bg-[var(--rb-primary)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--rb-primary)] font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">Zet op &quot;Gepubliceerd&quot;</p>
                    <p className="text-slate-500 mt-0.5">Om de content zichtbaar te maken op de website</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
