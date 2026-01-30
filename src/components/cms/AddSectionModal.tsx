'use client';

import { useState } from 'react';

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (sectionId: string) => void;
  existingSections: string[];
  page: string;
}

interface SectionTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'header' | 'content' | 'feature' | 'cta' | 'footer';
  preview: React.ReactNode;
}

const SECTION_TEMPLATES: SectionTemplate[] = [
  {
    id: 'hero',
    name: 'Hero',
    description: 'Grote header met titel, tekst en call-to-action',
    icon: '🎯',
    category: 'header',
    preview: (
      <div className="bg-gradient-to-br from-[var(--rb-primary)] to-[var(--rb-primary-dark)] p-4 rounded-lg text-white">
        <div className="text-lg font-bold mb-1">Hero Titel</div>
        <div className="text-xs opacity-80">Ondertekst en call-to-action buttons</div>
      </div>
    ),
  },
  {
    id: 'intro',
    name: 'Introductie',
    description: 'Korte introductie sectie met titel en tekst',
    icon: '📝',
    category: 'content',
    preview: (
      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <div className="text-xs text-[var(--rb-primary)] font-semibold uppercase mb-1">Label</div>
        <div className="text-base font-bold text-slate-800 mb-1">Sectie Titel</div>
        <div className="text-xs text-slate-600">Introductie tekst...</div>
      </div>
    ),
  },
  {
    id: 'vision',
    name: 'Visie / Over ons',
    description: 'Twee-koloms layout met afbeelding en tekst',
    icon: '👁️',
    category: 'content',
    preview: (
      <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-lg border border-slate-200">
        <div className="bg-slate-200 rounded h-16" />
        <div>
          <div className="text-xs font-bold text-slate-800 mb-1">Onze Visie</div>
          <div className="text-[10px] text-slate-600">Tekst...</div>
        </div>
      </div>
    ),
  },
  {
    id: 'disciplines',
    name: 'Diensten / Features',
    description: 'Grid met iconen voor disciplines of diensten',
    icon: '⚡',
    category: 'feature',
    preview: (
      <div className="bg-slate-50 p-3 rounded-lg">
        <div className="text-center text-xs font-bold text-slate-800 mb-2">Onze Diensten</div>
        <div className="grid grid-cols-4 gap-1">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-2 rounded border border-slate-200 text-center">
              <div className="w-4 h-4 bg-[var(--rb-primary)]/20 rounded mx-auto mb-1" />
              <div className="text-[8px] text-slate-600">Item</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'story',
    name: 'Verhaal / Historie',
    description: 'Vertel het verhaal achter je organisatie',
    icon: '📖',
    category: 'content',
    preview: (
      <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-lg border border-slate-200">
        <div>
          <div className="text-xs font-bold text-slate-800 mb-1">Ons Verhaal</div>
          <div className="text-[10px] text-slate-600">Historie...</div>
        </div>
        <div className="bg-slate-200 rounded h-16" />
      </div>
    ),
  },
  {
    id: 'cta',
    name: 'Call-to-Action',
    description: 'Opvallende sectie om actie te ondernemen',
    icon: '🚀',
    category: 'cta',
    preview: (
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 rounded-lg text-white text-center">
        <div className="text-sm font-bold mb-1">Klaar om te starten?</div>
        <div className="inline-block bg-white text-emerald-600 text-[10px] px-3 py-1 rounded-full font-semibold">
          Button
        </div>
      </div>
    ),
  },
  {
    id: 'members',
    name: 'Team leden',
    description: 'Toon teamleden met foto\'s en info',
    icon: '👥',
    category: 'content',
    preview: (
      <div className="bg-white p-3 rounded-lg border border-slate-200">
        <div className="text-center text-xs font-bold text-slate-800 mb-2">Ons Team</div>
        <div className="flex gap-2 justify-center">
          {[1, 2, 3].map(i => (
            <div key={i} className="text-center">
              <div className="w-8 h-8 bg-slate-200 rounded-full mx-auto mb-1" />
              <div className="text-[8px] text-slate-600">Naam</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'list',
    name: 'Lijst / Cards',
    description: 'Lijstweergave met cards voor items',
    icon: '📋',
    category: 'content',
    preview: (
      <div className="bg-slate-50 p-3 rounded-lg space-y-2">
        <div className="bg-white p-2 rounded border border-slate-200">
          <div className="text-xs font-semibold text-slate-800">Item 1</div>
          <div className="text-[10px] text-slate-600">Beschrijving...</div>
        </div>
        <div className="bg-white p-2 rounded border border-slate-200">
          <div className="text-xs font-semibold text-slate-800">Item 2</div>
          <div className="text-[10px] text-slate-600">Beschrijving...</div>
        </div>
      </div>
    ),
  },
  {
    id: 'pricing',
    name: 'Prijzen / Tarieven',
    description: 'Prijs tabel of tarieven overzicht',
    icon: '💶',
    category: 'feature',
    preview: (
      <div className="bg-white p-3 rounded-lg border border-slate-200">
        <div className="text-center text-xs font-bold text-slate-800 mb-2">Tarieven</div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] bg-slate-50 p-2 rounded">
            <span>Dienst</span>
            <span className="font-semibold">€50</span>
          </div>
          <div className="flex justify-between text-[10px] bg-slate-50 p-2 rounded">
            <span>Dienst</span>
            <span className="font-semibold">€75</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'faq',
    name: 'FAQ / Vragen',
    description: 'Veelgestelde vragen sectie',
    icon: '❓',
    category: 'content',
    preview: (
      <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
        <div className="border-b border-slate-100 pb-2">
          <div className="text-xs font-semibold text-slate-800">Vraag 1?</div>
          <div className="text-[10px] text-slate-600">Antwoord...</div>
        </div>
        <div className="border-b border-slate-100 pb-2">
          <div className="text-xs font-semibold text-slate-800">Vraag 2?</div>
          <div className="text-[10px] text-slate-600">Antwoord...</div>
        </div>
      </div>
    ),
  },
  {
    id: 'form',
    name: 'Contact Formulier',
    description: 'Contact formulier sectie',
    icon: '📧',
    category: 'cta',
    preview: (
      <div className="bg-slate-50 p-3 rounded-lg">
        <div className="text-xs font-bold text-slate-800 mb-2">Contact</div>
        <div className="space-y-1.5">
          <div className="h-5 bg-white rounded border border-slate-200" />
          <div className="h-5 bg-white rounded border border-slate-200" />
          <div className="h-8 bg-white rounded border border-slate-200" />
        </div>
      </div>
    ),
  },
  {
    id: 'info',
    name: 'Contact Info',
    description: 'Contactgegevens en adres',
    icon: '📍',
    category: 'content',
    preview: (
      <div className="bg-white p-3 rounded-lg border border-slate-200">
        <div className="text-xs font-bold text-slate-800 mb-2">Contactgegevens</div>
        <div className="space-y-1 text-[10px] text-slate-600">
          <div>📍 Adres</div>
          <div>📞 Telefoon</div>
          <div>✉️ Email</div>
        </div>
      </div>
    ),
  },
  {
    id: 'map',
    name: 'Kaart / Locatie',
    description: 'Google Maps of kaart weergave',
    icon: '🗺️',
    category: 'content',
    preview: (
      <div className="bg-slate-200 p-3 rounded-lg h-20 flex items-center justify-center">
        <div className="text-xs text-slate-500">🗺️ Kaart</div>
      </div>
    ),
  },
  {
    id: 'process',
    name: 'Proces / Stappen',
    description: 'Stap-voor-stap proces uitleg',
    icon: '🔄',
    category: 'feature',
    preview: (
      <div className="bg-white p-3 rounded-lg border border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[var(--rb-primary)] text-white flex items-center justify-center text-[10px] font-bold">1</div>
          <div className="text-[10px] text-slate-600">Stap 1</div>
          <div className="flex-1 h-px bg-slate-200" />
          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold">2</div>
          <div className="text-[10px] text-slate-600">Stap 2</div>
        </div>
      </div>
    ),
  },
  {
    id: 'content',
    name: 'Content blok',
    description: 'Eenvoudige tekst sectie',
    icon: '📄',
    category: 'content',
    preview: (
      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <div className="text-sm font-bold text-slate-800 mb-2">Titel</div>
        <div className="space-y-1">
          <div className="h-2 bg-slate-100 rounded w-full" />
          <div className="h-2 bg-slate-100 rounded w-5/6" />
          <div className="h-2 bg-slate-100 rounded w-4/6" />
        </div>
      </div>
    ),
  },
];

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  header: { label: 'Header', color: 'bg-purple-100 text-purple-700' },
  content: { label: 'Content', color: 'bg-blue-100 text-blue-700' },
  feature: { label: 'Features', color: 'bg-emerald-100 text-emerald-700' },
  cta: { label: 'CTA', color: 'bg-amber-100 text-amber-700' },
  footer: { label: 'Footer', color: 'bg-slate-100 text-slate-700' },
};

export default function AddSectionModal({
  isOpen,
  onClose,
  onSelect,
  existingSections,
  page,
}: AddSectionModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const categories = ['all', ...Array.from(new Set(SECTION_TEMPLATES.map(t => t.category)))];

  const filteredTemplates = SECTION_TEMPLATES.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isExisting = (id: string) => existingSections.includes(id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Sectie toevoegen</h2>
              <p className="text-slate-500 text-sm">Kies een sectie type om toe te voegen aan je pagina</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Zoek secties..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-0 rounded-xl text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white transition-all"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${selectedCategory === category
                      ? 'bg-[var(--rb-primary)] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }
                  `}
                >
                  {category === 'all' ? 'Alle' : CATEGORY_LABELS[category]?.label || category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-slate-500 font-medium">Geen secties gevonden</p>
              <p className="text-sm text-slate-400 mt-1">Probeer een andere zoekterm</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => {
                const existing = isExisting(template.id);
                const categoryStyle = CATEGORY_LABELS[template.category];
                
                return (
                  <button
                    key={template.id}
                    onClick={() => !existing && onSelect(template.id)}
                    disabled={existing}
                    className={`
                      relative text-left p-4 rounded-xl border-2 transition-all group
                      ${existing 
                        ? 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed' 
                        : 'border-slate-200 bg-white hover:border-[var(--rb-primary)] hover:shadow-lg cursor-pointer'
                      }
                    `}
                  >
                    {/* Preview */}
                    <div className="mb-3 scale-95 origin-top-left">
                      {template.preview}
                    </div>

                    {/* Info */}
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{template.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">{template.name}</span>
                          {existing && (
                            <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-full">
                              AANWEZIG
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{template.description}</p>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <span className={`
                      absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold rounded-full uppercase
                      ${categoryStyle.color}
                    `}>
                      {categoryStyle.label}
                    </span>

                    {/* Add indicator */}
                    {!existing && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--rb-primary)]/5 rounded-xl">
                        <div className="w-12 h-12 bg-[var(--rb-primary)] rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>{filteredTemplates.filter(t => !isExisting(t.id)).length} beschikbare secties</span>
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
            >
              Annuleren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
