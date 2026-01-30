'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getAllPageContent, type PageContentData } from '@/modules/page-content/queries';
import { savePageContent, deletePageContent, seedPageContentStructure, addSection } from '@/modules/page-content/actions';
import LivePreview from '@/components/cms/LivePreview';
import SectionEditor from '@/components/cms/SectionEditor';
import AddSectionModal from '@/components/cms/AddSectionModal';

const PAGES = [
  { id: 'home', label: 'Homepage', icon: '🏠', description: 'Landingspagina', color: 'bg-blue-500' },
  { id: 'team', label: 'Team', icon: '👥', description: 'Teamleden', color: 'bg-purple-500' },
  { id: 'treatments', label: 'Behandelingen', icon: '💊', description: 'Therapieën', color: 'bg-emerald-500' },
  { id: 'disciplines', label: 'Disciplines', icon: '🎯', description: 'Specialisaties', color: 'bg-amber-500' },
  { id: 'costs', label: 'Tarieven', icon: '💶', description: 'Prijzen', color: 'bg-rose-500' },
  { id: 'contact', label: 'Contact', icon: '📧', description: 'Contactinfo', color: 'bg-cyan-500' },
  { id: 'verwijzers', label: 'Verwijzers', icon: '🔗', description: 'Voor artsen', color: 'bg-indigo-500' },
  { id: 'privacy', label: 'Privacy', icon: '🔒', description: 'Privacy policy', color: 'bg-slate-500' },
  { id: 'footer', label: 'Footer', icon: '📄', description: 'Voettekst', color: 'bg-gray-500' },
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-3 border-[var(--rb-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Content laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="flex-shrink-0 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Left: Logo & Page Selector */}
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="flex items-center gap-2 text-gray-600 hover:text-[var(--rb-primary)] transition-colors group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--rb-primary)] to-[var(--rb-primary-dark)] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <BrainIcon className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:block font-semibold text-sm">RevaBrain</span>
            </Link>

            <div className="h-6 w-px bg-gray-200" />

            {/* Page Selector */}
            <div className="relative">
              <button
                onClick={() => setShowPageNav(!showPageNav)}
                className="flex items-center gap-3 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all group"
              >
                <span className="text-2xl">{currentPageInfo?.icon}</span>
                <div className="text-left hidden sm:block">
                  <div className="text-gray-900 font-semibold text-sm">{currentPageInfo?.label}</div>
                  <div className="text-gray-500 text-xs">{currentPageInfo?.description}</div>
                </div>
                <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${showPageNav ? 'rotate-180' : ''}`} />
              </button>

              {showPageNav && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowPageNav(false)} />
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    <div className="p-2 max-h-[400px] overflow-y-auto scrollbar-thin">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
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
                              : 'text-gray-700 hover:bg-gray-50'
                            }
                          `}
                        >
                          <span className="text-2xl">{page.icon}</span>
                          <div className="text-left flex-1">
                            <div className="font-medium text-sm">{page.label}</div>
                            <div className={`text-xs ${selectedPage === page.id ? 'text-white/70' : 'text-gray-500'}`}>
                              {page.description}
                            </div>
                          </div>
                          {selectedPage === page.id && (
                            <CheckIcon className="w-5 h-5" />
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
          <div className="flex items-center bg-gray-100 p-1 rounded-xl">
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
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
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
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-all text-sm font-medium border border-amber-100"
              >
                <PlusIcon className="w-4 h-4" />
                Structuur aanmaken
              </button>
            )}

            <Link
              href={`/${selectedPage === 'home' ? '' : selectedPage}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium border border-gray-200 shadow-sm"
            >
              <EyeIcon className="w-4 h-4" />
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
          ${message.type === 'info' ? 'bg-[var(--rb-primary)] text-white' : ''}
        `}>
          {message.type === 'success' ? (
            <CheckIcon className="w-5 h-5" />
          ) : message.type === 'error' ? (
            <AlertIcon className="w-5 h-5" />
          ) : (
            <InfoIcon className="w-5 h-5" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Main Content: Split View */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left: Live Preview */}
        <div className="flex-1 flex flex-col min-h-0 bg-gray-100">
          {/* Preview Toolbar */}
          <div className="flex-shrink-0 bg-white border-b border-gray-100 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-gray-900 font-semibold flex items-center gap-2">
                  <LayoutIcon className="w-5 h-5 text-[var(--rb-primary)]" />
                  Page Builder
                </h2>
                
                {/* Device View Toggle */}
                <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setDeviceView('desktop')}
                    className={`p-1.5 rounded-md transition-all ${deviceView === 'desktop' ? 'bg-white shadow-sm text-[var(--rb-primary)]' : 'text-gray-500 hover:text-gray-700'}`}
                    title="Desktop weergave"
                  >
                    <MonitorIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeviceView('tablet')}
                    className={`p-1.5 rounded-md transition-all ${deviceView === 'tablet' ? 'bg-white shadow-sm text-[var(--rb-primary)]' : 'text-gray-500 hover:text-gray-700'}`}
                    title="Tablet weergave"
                  >
                    <TabletIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeviceView('mobile')}
                    className={`p-1.5 rounded-md transition-all ${deviceView === 'mobile' ? 'bg-white shadow-sm text-[var(--rb-primary)]' : 'text-gray-500 hover:text-gray-700'}`}
                    title="Mobiele weergave"
                  >
                    <SmartphoneIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Stats */}
                <div className="hidden lg:flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {publishedCount} gepubliceerd
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    {draftCount} drafts
                  </span>
                </div>

                {/* Add Section Button */}
                <button
                  onClick={() => setShowAddSection(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--rb-primary)] text-white rounded-xl hover:bg-[var(--rb-primary-dark)] transition-all text-sm font-medium shadow-md shadow-[var(--rb-primary)]/20"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span className="hidden sm:block">Sectie toevoegen</span>
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
          w-[400px] flex-shrink-0 bg-white border-l border-gray-100 flex flex-col
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
      <footer className="flex-shrink-0 bg-white border-t border-gray-100 px-4 py-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-6 text-gray-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {publishedCount} gepubliceerd
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {draftCount} drafts
            </span>
            {emptyCount > 0 && (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-300" />
                {emptyCount} leeg
              </span>
            )}
          </div>
          <div className="text-gray-400">
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

// Icons
function BrainIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function LayoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
    </svg>
  );
}

function MonitorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function TabletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}

function SmartphoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
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

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
