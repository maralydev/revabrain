'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getAllPageContent, type PageContentData } from '@/modules/page-content/queries';
import { savePageContent, deletePageContent, seedPageContentStructure, addSection } from '@/modules/page-content/actions';
import LivePreview from '@/components/cms/LivePreview';
import SectionEditor from '@/components/cms/SectionEditor';
import AddSectionModal from '@/components/cms/AddSectionModal';

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
  { code: 'nl', name: 'NL', flag: '🇳🇱', fullName: 'Nederlands' },
  { code: 'fr', name: 'FR', flag: '🇫🇷', fullName: 'Français' },
  { code: 'en', name: 'EN', flag: '🇬🇧', fullName: 'English' },
];

// Section order for each page
const PAGE_SECTION_ORDER: Record<string, string[]> = {
  home: ['hero', 'vision', 'disciplines', 'story', 'cta'],
  team: ['hero', 'intro', 'members', 'cta'],
  treatments: ['hero', 'intro', 'list', 'cta'],
  disciplines: ['hero', 'intro', 'list'],
  costs: ['hero', 'intro', 'pricing', 'insurance', 'convention', 'homeVisits', 'cta'],
  contact: ['hero', 'info', 'form', 'map', 'homeVisitsNote'],
  verwijzers: ['hero', 'intro', 'process', 'faq', 'cta'],
  privacy: ['hero', 'content'],
  footer: ['contact', 'hours', 'social', 'legal'],
};

export default function VisualCMSPage() {
  const [content, setContent] = useState<PageContentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [selectedLocale, setSelectedLocale] = useState<string>('nl');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPageNav, setShowPageNav] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    loadContent();
  }, []);

  // Auto-hide message after 4 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  async function loadContent() {
    setLoading(true);
    const data = await getAllPageContent();
    setContent(data);
    setLoading(false);
  }

  // Filter and sort content for current page and locale
  const filteredContent = content.filter(
    (c) => c.page === selectedPage && c.locale === selectedLocale
  );

  // Sort sections by defined order
  const sectionOrder = PAGE_SECTION_ORDER[selectedPage] || [];
  const sortedSections = [...filteredContent].sort((a, b) => {
    const aIndex = sectionOrder.indexOf(a.section);
    const bIndex = sectionOrder.indexOf(b.section);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

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

  // Calculate stats
  const publishedCount = filteredContent.filter(c => c.published).length;
  const draftCount = filteredContent.filter(c => !c.published && c.title).length;
  const emptyCount = filteredContent.filter(c => !c.title && !c.content).length;

  async function handleSave(data: Partial<PageContentData>) {
    if (!selectedSection) return;
    setSaving(true);
    setMessage(null);

    // Filter out null values and convert to undefined for ContentInput
    const toUndefined = (val: string | null | undefined): string | undefined => val === null || val === undefined ? undefined : val;

    const result = await savePageContent({
      page: selectedPage,
      section: selectedSection,
      locale: selectedLocale,
      title: toUndefined(data.title),
      subtitle: toUndefined(data.subtitle),
      content: toUndefined(data.content),
      content2: toUndefined(data.content2),
      imageUrl: toUndefined(data.imageUrl),
      buttonText: toUndefined(data.buttonText),
      buttonUrl: toUndefined(data.buttonUrl),
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

  async function handleAddSection(sectionId: string) {
    const result = await addSection(selectedPage, sectionId, selectedLocale);

    if (result.success) {
      setMessage({ type: 'success', text: `Sectie toegevoegd` });
      setShowAddSection(false);
      await loadContent();
      setSelectedSection(sectionId);
    } else {
      setMessage({ type: 'error', text: result.error || 'Toevoegen mislukt' });
    }
  }

  const handleInlineEdit = useCallback((section: string, field: string, value: string) => {
    // Debounced auto-save for inline editing
    const sectionData = filteredContent.find(c => c.section === section);
    if (sectionData) {
      const input: Parameters<typeof savePageContent>[0] = {
        page: selectedPage,
        section,
        locale: selectedLocale,
        published: sectionData.published,
      };
      // Only add the field if it's a valid ContentInput key
      if (field === 'title' || field === 'subtitle' || field === 'content' || 
          field === 'content2' || field === 'imageUrl' || field === 'buttonText' || field === 'buttonUrl') {
        input[field] = value;
      }
      savePageContent(input).then(() => {
        loadContent();
      });
    }
  }, [filteredContent, selectedPage, selectedLocale]);

  const currentPageInfo = PAGES.find(p => p.id === selectedPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-3 border-[var(--rb-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500">Content laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Left: Logo & Page Selector */}
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="flex items-center gap-2 text-slate-700 hover:text-[var(--rb-primary)] transition-colors"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-[var(--rb-primary)] to-[var(--rb-accent)] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </div>
            </Link>

            <div className="h-6 w-px bg-slate-200" />

            {/* Page Selector */}
            <div className="relative">
              <button
                onClick={() => setShowPageNav(!showPageNav)}
                className="flex items-center gap-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all group"
              >
                <span className="text-xl">{currentPageInfo?.icon}</span>
                <div className="text-left">
                  <div className="text-slate-800 font-semibold text-sm">{currentPageInfo?.label}</div>
                  <div className="text-slate-500 text-xs">{currentPageInfo?.description}</div>
                </div>
                <svg className={`w-4 h-4 text-slate-400 transition-transform ${showPageNav ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showPageNav && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowPageNav(false)} />
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
                    <div className="p-2 max-h-[400px] overflow-y-auto">
                      <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Kies een pagina
                      </div>
                      {PAGES.map((page) => (
                        <button
                          key={page.id}
                          onClick={() => {
                            setSelectedPage(page.id);
                            setSelectedSection(null);
                            setShowPageNav(false);
                          }}
                          className={`
                            w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                            ${selectedPage === page.id
                              ? 'bg-[var(--rb-primary)] text-white'
                              : 'text-slate-700 hover:bg-slate-100'
                            }
                          `}
                        >
                          <span className="text-xl">{page.icon}</span>
                          <div className="text-left flex-1">
                            <div className="font-medium text-sm">{page.label}</div>
                            <div className={`text-xs ${selectedPage === page.id ? 'text-white/70' : 'text-slate-500'}`}>
                              {page.description}
                            </div>
                          </div>
                          {selectedPage === page.id && (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            {LOCALES.map((locale) => (
              <button
                key={locale.code}
                onClick={() => {
                  setSelectedLocale(locale.code);
                  setSelectedSection(null);
                }}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${selectedLocale === locale.code
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                  }
                `}
                title={locale.fullName}
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
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition-all text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Structuur aanmaken
              </button>
            )}

            <Link
              href={`/${selectedPage === 'home' ? '' : selectedPage}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="hidden sm:block">Preview</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Toast Message */}
      {message && (
        <div className={`
          fixed top-20 left-1/2 -translate-x-1/2 z-50
          px-6 py-3 rounded-xl shadow-xl
          animate-in fade-in slide-in-from-top-4 duration-300
          flex items-center gap-3
          ${message.type === 'success' ? 'bg-emerald-500 text-white' : ''}
          ${message.type === 'error' ? 'bg-red-500 text-white' : ''}
          ${message.type === 'info' ? 'bg-blue-500 text-white' : ''}
        `}>
          {message.type === 'success' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : message.type === 'error' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Main Content: Split View */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left: Live Preview */}
        <div className="flex-1 flex flex-col min-h-0 bg-slate-100">
          {/* Preview Toolbar */}
          <div className="flex-shrink-0 bg-white border-b border-slate-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-slate-800 font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5 text-[var(--rb-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  Page Builder
                </h2>
                
                {/* Device View Toggle */}
                <div className="hidden md:flex items-center bg-slate-100 rounded-lg p-1">
                  <button
                    onClick={() => setDeviceView('desktop')}
                    className={`p-1.5 rounded-md transition-all ${deviceView === 'desktop' ? 'bg-white shadow-sm text-[var(--rb-primary)]' : 'text-slate-500 hover:text-slate-700'}`}
                    title="Desktop weergave"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeviceView('tablet')}
                    className={`p-1.5 rounded-md transition-all ${deviceView === 'tablet' ? 'bg-white shadow-sm text-[var(--rb-primary)]' : 'text-slate-500 hover:text-slate-700'}`}
                    title="Tablet weergave"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeviceView('mobile')}
                    className={`p-1.5 rounded-md transition-all ${deviceView === 'mobile' ? 'bg-white shadow-sm text-[var(--rb-primary)]' : 'text-slate-500 hover:text-slate-700'}`}
                    title="Mobiele weergave"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Add Section Button */}
                <button
                  onClick={() => setShowAddSection(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--rb-primary)] text-white rounded-xl hover:bg-[var(--rb-primary-dark)] transition-all text-sm font-medium shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Sectie toevoegen
                </button>
              </div>
            </div>
          </div>

          {/* Preview Canvas */}
          <div className="flex-1 overflow-auto p-4 md:p-8">
            <div className={`
              mx-auto transition-all duration-300
              ${deviceView === 'desktop' ? 'max-w-6xl' : ''}
              ${deviceView === 'tablet' ? 'max-w-3xl' : ''}
              ${deviceView === 'mobile' ? 'max-w-md' : ''}
            `}>
              <LivePreview
                page={selectedPage}
                sections={sortedSections}
                selectedSection={selectedSection}
                onSelectSection={setSelectedSection}
                onInlineEdit={handleInlineEdit}
                deviceView={deviceView}
              />
            </div>
          </div>
        </div>

        {/* Right: Section Editor Panel */}
        <div className={`
          w-[400px] flex-shrink-0 bg-white border-l border-slate-200 flex flex-col
          transition-all duration-300
          ${selectedSection ? 'translate-x-0' : 'translate-x-full'}
          absolute right-0 top-[64px] bottom-0 z-30 shadow-xl
          lg:relative lg:top-0 lg:shadow-none lg:translate-x-0
        `}>
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
      <footer className="flex-shrink-0 bg-white border-t border-slate-200 px-4 py-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-6 text-slate-500">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              {publishedCount} gepubliceerd
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              {draftCount} drafts
            </span>
            {emptyCount > 0 && (
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-300" />
                {emptyCount} leeg
              </span>
            )}
          </div>
          <div className="text-slate-400">
            {currentPageInfo?.label} • {LOCALES.find(l => l.code === selectedLocale)?.fullName}
          </div>
        </div>
      </footer>

      {/* Add Section Modal */}
      <AddSectionModal
        isOpen={showAddSection}
        onClose={() => setShowAddSection(false)}
        onSelect={handleAddSection}
        existingSections={filteredContent.map(c => c.section)}
        page={selectedPage}
      />
    </div>
  );
}
