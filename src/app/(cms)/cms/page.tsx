'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllPageContent, type PageContentData } from '@/modules/page-content/queries';
import { savePageContent, deletePageContent, togglePublished, seedPageContentStructure, addSection } from '@/modules/page-content/actions';
import LivePreview from '@/components/cms/LivePreview';
import SectionEditor from '@/components/cms/SectionEditor';

const PAGES = [
  { id: 'home', label: 'Homepage', icon: '🏠', description: 'Landingspagina' },
  { id: 'team', label: 'Team', icon: '👥', description: 'Teamleden' },
  { id: 'treatments', label: 'Behandelingen', icon: '💊', description: 'Therapieën' },
  { id: 'disciplines', label: 'Disciplines', icon: '🎯', description: 'Specialisaties' },
  { id: 'costs', label: 'Tarieven', icon: '💶', description: 'Prijzen' },
  { id: 'contact', label: 'Contact', icon: '📧', description: 'Contactinfo' },
  { id: 'verwijzers', label: 'Verwijzers', icon: '🔗', description: 'Voor artsen' },
  { id: 'privacy', label: 'Privacy', icon: '🔒', description: 'Privacy policy' },
  { id: 'footer', label: 'Footer', icon: '📄', description: 'Voettekst' },
];

const LOCALES = [
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
];

export default function VisualCMSPage() {
  const [content, setContent] = useState<PageContentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [selectedLocale, setSelectedLocale] = useState<string>('nl');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPageNav, setShowPageNav] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');

  useEffect(() => {
    loadContent();
  }, []);

  // Auto-hide message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  async function loadContent() {
    setLoading(true);
    const data = await getAllPageContent();
    setContent(data);
    setLoading(false);
  }

  // Filter content for current page and locale
  const filteredContent = content.filter(
    (c) => c.page === selectedPage && c.locale === selectedLocale
  );

  // Get selected section data
  const selectedSectionData = selectedSection
    ? filteredContent.find(c => c.section === selectedSection) || {
        id: -1,
        page: selectedPage,
        section: selectedSection,
        locale: selectedLocale,
        title: null,
        subtitle: null,
        content: null,
        content2: null,
        imageUrl: null,
        buttonText: null,
        buttonUrl: null,
        published: false,
        aangemaakt: new Date(),
        laatstGewijzigd: new Date(),
      }
    : null;

  async function handleSave(data: Partial<PageContentData>) {
    if (!selectedSection) return;
    setSaving(true);
    setMessage(null);

    const result = await savePageContent({
      page: selectedPage,
      section: selectedSection,
      locale: selectedLocale,
      title: data.title || undefined,
      subtitle: data.subtitle || undefined,
      content: data.content || undefined,
      content2: data.content2 || undefined,
      imageUrl: data.imageUrl || undefined,
      buttonText: data.buttonText || undefined,
      buttonUrl: data.buttonUrl || undefined,
      published: data.published ?? false,
    });

    setSaving(false);

    if (result.success) {
      setMessage({ type: 'success', text: '✓ Wijzigingen opgeslagen' });
      await loadContent();
    } else {
      setMessage({ type: 'error', text: result.error || 'Opslaan mislukt' });
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Weet je zeker dat je deze sectie wilt verwijderen?')) return;

    const result = await deletePageContent(id);
    if (result.success) {
      setMessage({ type: 'success', text: 'Sectie verwijderd' });
      setSelectedSection(null);
      await loadContent();
    } else {
      setMessage({ type: 'error', text: result.error || 'Verwijderen mislukt' });
    }
  }

  async function handleSeedContent() {
    if (!confirm('Wil je de standaard content structuur aanmaken voor alle pagina\'s?')) return;

    const result = await seedPageContentStructure();
    if (result.success) {
      setMessage({ type: 'success', text: `${result.created} secties aangemaakt` });
      await loadContent();
    }
  }

  async function handleAddSection() {
    if (!newSectionName.trim()) return;

    const sectionId = newSectionName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const result = await addSection(selectedPage, sectionId, selectedLocale);

    if (result.success) {
      setMessage({ type: 'success', text: `Sectie "${sectionId}" toegevoegd` });
      setNewSectionName('');
      setShowAddSection(false);
      await loadContent();
      setSelectedSection(sectionId);
    } else {
      setMessage({ type: 'error', text: result.error || 'Toevoegen mislukt' });
    }
  }

  const currentPageInfo = PAGES.find(p => p.id === selectedPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-3 border-[var(--rb-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60">Content laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="flex-shrink-0 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Left: Logo & Page Selector */}
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2 text-white font-bold hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--rb-primary)] to-[var(--rb-accent)] rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </div>
              <span className="hidden sm:block">Terug naar Admin</span>
            </Link>

            <div className="h-8 w-px bg-slate-700" />

            {/* Page Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPageNav(!showPageNav)}
                className="flex items-center gap-3 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-all group"
              >
                <span className="text-xl">{currentPageInfo?.icon}</span>
                <div className="text-left">
                  <div className="text-white font-medium text-sm">{currentPageInfo?.label}</div>
                  <div className="text-slate-400 text-xs">{currentPageInfo?.description}</div>
                </div>
                <svg className={`w-4 h-4 text-slate-400 transition-transform ${showPageNav ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showPageNav && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowPageNav(false)} />
                  <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden z-50">
                    <div className="p-2 max-h-[400px] overflow-y-auto">
                      {PAGES.map((page) => (
                        <button
                          key={page.id}
                          onClick={() => {
                            setSelectedPage(page.id);
                            setSelectedSection(null);
                            setShowPageNav(false);
                          }}
                          className={`
                            w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                            ${selectedPage === page.id
                              ? 'bg-[var(--rb-primary)] text-white'
                              : 'text-slate-300 hover:bg-slate-700'
                            }
                          `}
                        >
                          <span className="text-xl">{page.icon}</span>
                          <div className="text-left">
                            <div className="font-medium text-sm">{page.label}</div>
                            <div className={`text-xs ${selectedPage === page.id ? 'text-white/70' : 'text-slate-500'}`}>
                              {page.description}
                            </div>
                          </div>
                          {selectedPage === page.id && (
                            <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Center: Language Switcher */}
          <div className="flex items-center gap-1 bg-slate-700/50 p-1 rounded-xl">
            {LOCALES.map((locale) => (
              <button
                key={locale.code}
                onClick={() => {
                  setSelectedLocale(locale.code);
                  setSelectedSection(null);
                }}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${selectedLocale === locale.code
                    ? 'bg-white text-slate-800 shadow'
                    : 'text-slate-400 hover:text-white'
                  }
                `}
              >
                <span>{locale.flag}</span>
                <span className="hidden sm:block">{locale.name}</span>
              </button>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {filteredContent.length === 0 && (
              <button
                onClick={handleSeedContent}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-xl hover:bg-amber-500/30 transition-all text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Seed Content
              </button>
            )}

            <Link
              href={`/${selectedPage === 'home' ? '' : selectedPage}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="hidden sm:block">Bekijk live</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Toast Message */}
      {message && (
        <div className={`
          fixed top-20 left-1/2 -translate-x-1/2 z-50
          px-6 py-3 rounded-xl shadow-2xl
          animate-in fade-in slide-in-from-top-4 duration-300
          flex items-center gap-3
          ${message.type === 'success'
            ? 'bg-emerald-500 text-white'
            : 'bg-red-500 text-white'
          }
        `}>
          {message.type === 'success' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Main Content: Split View */}
      <div className="flex-1 flex min-h-0">
        {/* Left: Live Preview */}
        <div className="flex-1 p-6 overflow-auto bg-slate-800/50">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--rb-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Live Preview
              </h2>
              <p className="text-slate-400 text-sm mt-0.5">
                Klik op een sectie om te bewerken
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-xs">Secties:</span>
                <div className="flex items-center gap-1 flex-wrap">
                  {filteredContent.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setSelectedSection(section.section)}
                      className={`
                        px-2 py-1 text-xs rounded-lg transition-all
                        ${selectedSection === section.section
                          ? 'bg-[var(--rb-primary)] text-white'
                          : section.published
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                            : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                        }
                      `}
                      title={section.published ? 'Gepubliceerd' : 'Draft'}
                    >
                      {section.section}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Section Button */}
              <div className="relative">
                <button
                  onClick={() => setShowAddSection(!showAddSection)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--rb-primary)]/20 text-[var(--rb-primary)] rounded-lg hover:bg-[var(--rb-primary)]/30 transition-all text-xs font-medium"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Sectie
                </button>

                {showAddSection && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowAddSection(false)} />
                    <div className="absolute top-full right-0 mt-2 w-72 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-50 p-4">
                      <h4 className="text-white font-medium text-sm mb-3">Nieuwe sectie toevoegen</h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newSectionName}
                          onChange={(e) => setNewSectionName(e.target.value)}
                          placeholder="Sectie naam (bijv. faq)"
                          className="flex-1 px-3 py-2 bg-slate-700 text-white text-sm rounded-lg border-0 focus:ring-2 focus:ring-[var(--rb-primary)] placeholder:text-slate-500"
                          onKeyDown={(e) => e.key === 'Enter' && handleAddSection()}
                        />
                        <button
                          onClick={handleAddSection}
                          disabled={!newSectionName.trim()}
                          className="px-4 py-2 bg-[var(--rb-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--rb-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          Toevoegen
                        </button>
                      </div>
                      <p className="text-slate-500 text-xs mt-2">
                        De sectie wordt aangemaakt voor {selectedLocale.toUpperCase()}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <LivePreview
              page={selectedPage}
              sections={filteredContent}
              selectedSection={selectedSection}
              onSelectSection={setSelectedSection}
            />
          </div>
        </div>

        {/* Right: Section Editor */}
        <div className="w-[420px] flex-shrink-0 bg-white border-l border-slate-200 flex flex-col">
          <SectionEditor
            section={selectedSectionData}
            page={selectedPage}
            locale={selectedLocale}
            onSave={handleSave}
            onDelete={handleDelete}
            onClose={() => setSelectedSection(null)}
            saving={saving}
          />
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="flex-shrink-0 bg-slate-800 border-t border-slate-700 px-4 py-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              {filteredContent.filter(c => c.published).length} gepubliceerd
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              {filteredContent.filter(c => !c.published).length} drafts
            </span>
          </div>
          <div className="text-slate-500">
            Visual CMS v2.0 • RevaBrain Admin
          </div>
        </div>
      </div>
    </div>
  );
}
