'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface ContentSection {
  id: number;
  section: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  content2: string | null;
  imageUrl: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  published: boolean;
}

interface SectionEditorProps {
  section: ContentSection | null;
  page: string;
  locale: string;
  onSave: (data: Partial<ContentSection>) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  onClose: () => void;
  saving: boolean;
}

// Section display names and icons
const SECTION_INFO: Record<string, { name: string; icon: string; description: string }> = {
  hero: { 
    name: 'Hero', 
    icon: '🎯',
    description: 'De eerste indruk - titel, tekst en call-to-action'
  },
  vision: { 
    name: 'Visie', 
    icon: '👁️',
    description: 'Over ons sectie met afbeelding en tekst'
  },
  disciplines: { 
    name: 'Diensten', 
    icon: '⚡',
    description: 'Overzicht van disciplines en specialisaties'
  },
  story: { 
    name: 'Verhaal', 
    icon: '📖',
    description: 'Het verhaal achter je organisatie'
  },
  cta: { 
    name: 'Call-to-Action', 
    icon: '🚀',
    description: 'Opvallende actie-sectie'
  },
  intro: { 
    name: 'Introductie', 
    icon: '📝',
    description: 'Korte introductie bovenaan de pagina'
  },
  members: { 
    name: 'Team', 
    icon: '👥',
    description: 'Teamleden en medewerkers'
  },
  list: { 
    name: 'Lijst', 
    icon: '📋',
    description: 'Lijstweergave met items'
  },
  pricing: { 
    name: 'Tarieven', 
    icon: '💶',
    description: 'Prijsinformatie en tarieven'
  },
  faq: { 
    name: 'FAQ', 
    icon: '❓',
    description: 'Veelgestelde vragen'
  },
  form: { 
    name: 'Formulier', 
    icon: '📧',
    description: 'Contact formulier'
  },
  info: { 
    name: 'Contact Info', 
    icon: '📍',
    description: 'Contactgegevens en adres'
  },
  map: { 
    name: 'Locatie', 
    icon: '🗺️',
    description: 'Kaart en routebeschrijving'
  },
  process: { 
    name: 'Proces', 
    icon: '🔄',
    description: 'Stap-voor-stap uitleg'
  },
  content: { 
    name: 'Content', 
    icon: '📄',
    description: 'Eenvoudige tekst sectie'
  },
};

// Field configuration for each section type
const SECTION_FIELDS: Record<string, Array<{
  key: keyof ContentSection;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'image' | 'richtext';
  placeholder?: string;
  required?: boolean;
  rows?: number;
  help?: string;
}>> = {
  hero: [
    { key: 'title', label: 'Hoofdtitel', type: 'text', placeholder: 'Herstel begint met deskundige zorg', required: true, help: 'De belangrijkste boodschap - max 8 woorden' },
    { key: 'content', label: 'Ondertekst', type: 'textarea', placeholder: 'Welkom bij RevaBrain...', rows: 3, help: 'Korte uitleg van je praktijk' },
    { key: 'buttonText', label: 'Button tekst', type: 'text', placeholder: 'Maak een afspraak', help: 'Call-to-action tekst op de knop' },
    { key: 'buttonUrl', label: 'Button link', type: 'url', placeholder: '/contact', help: 'Waar de button naartoe leidt' },
  ],
  vision: [
    { key: 'subtitle', label: 'Label', type: 'text', placeholder: 'Over ons', help: 'Klein label boven de titel' },
    { key: 'title', label: 'Titel', type: 'text', placeholder: 'Onze Visie', required: true },
    { key: 'content', label: 'Eerste alinea', type: 'textarea', placeholder: 'RevaBrain is een jonge praktijk...', rows: 4 },
    { key: 'content2', label: 'Tweede alinea', type: 'textarea', placeholder: 'Wij streven ernaar...', rows: 4 },
    { key: 'imageUrl', label: 'Afbeelding', type: 'image', placeholder: '/images/onze-visie.jpg', help: 'URL van de afbeelding' },
  ],
  disciplines: [
    { key: 'subtitle', label: 'Label', type: 'text', placeholder: 'Wat we doen' },
    { key: 'title', label: 'Titel', type: 'text', placeholder: 'Onze Behandelingen', required: true },
    { key: 'content', label: 'Beschrijving', type: 'textarea', placeholder: 'Multidisciplinaire zorg voor...', rows: 3 },
  ],
  story: [
    { key: 'title', label: 'Label', type: 'text', placeholder: 'Ons verhaal' },
    { key: 'subtitle', label: 'Titel', type: 'text', placeholder: 'Ontstaan uit passie...', required: true },
    { key: 'content', label: 'Tekst', type: 'textarea', placeholder: 'Ons verhaal begint met...', rows: 5 },
    { key: 'imageUrl', label: 'Afbeelding', type: 'image', placeholder: '/images/team.jpg' },
  ],
  cta: [
    { key: 'title', label: 'Titel', type: 'text', placeholder: 'Klaar om de eerste stap te zetten?', required: true },
    { key: 'content', label: 'Tekst', type: 'textarea', placeholder: 'Neem contact met ons op...', rows: 2 },
    { key: 'buttonText', label: 'Button tekst', type: 'text', placeholder: 'Neem contact op' },
    { key: 'buttonUrl', label: 'Button link', type: 'url', placeholder: '/contact' },
  ],
  intro: [
    { key: 'subtitle', label: 'Label', type: 'text', placeholder: 'Introductie' },
    { key: 'title', label: 'Titel', type: 'text', placeholder: 'Pagina titel', required: true },
    { key: 'content', label: 'Tekst', type: 'textarea', placeholder: 'Introductietekst...', rows: 4 },
  ],
  members: [
    { key: 'subtitle', label: 'Label', type: 'text', placeholder: 'Ons team' },
    { key: 'title', label: 'Titel', type: 'text', placeholder: 'Maak kennis met ons team', required: true },
    { key: 'content', label: 'Introductie', type: 'textarea', placeholder: 'Ons team bestaat uit...', rows: 3 },
  ],
  list: [
    { key: 'subtitle', label: 'Label', type: 'text', placeholder: 'Overzicht' },
    { key: 'title', label: 'Titel', type: 'text', placeholder: 'Onze diensten', required: true },
    { key: 'content', label: 'Introductie', type: 'textarea', placeholder: 'Wij bieden de volgende...', rows: 3 },
  ],
  pricing: [
    { key: 'subtitle', label: 'Label', type: 'text', placeholder: 'Tarieven' },
    { key: 'title', label: 'Titel', type: 'text', placeholder: 'Onze tarieven', required: true },
    { key: 'content', label: 'Uitleg', type: 'textarea', placeholder: 'Onze tarieven zijn...', rows: 3 },
  ],
  faq: [
    { key: 'subtitle', label: 'Label', type: 'text', placeholder: 'FAQ' },
    { key: 'title', label: 'Titel', type: 'text', placeholder: 'Veelgestelde vragen', required: true },
    { key: 'content', label: 'Introductie', type: 'textarea', placeholder: 'Hier vindt u antwoorden...', rows: 2 },
  ],
  form: [
    { key: 'subtitle', label: 'Label', type: 'text', placeholder: 'Contact' },
    { key: 'title', label: 'Titel', type: 'text', placeholder: 'Neem contact op', required: true },
    { key: 'content', label: 'Omschrijving', type: 'textarea', placeholder: 'Vul het formulier in...', rows: 3 },
  ],
  info: [
    { key: 'subtitle', label: 'Label', type: 'text', placeholder: 'Contactgegevens' },
    { key: 'title', label: 'Titel', type: 'text', placeholder: 'Contact', required: true },
    { key: 'content', label: 'Adres & contact', type: 'textarea', placeholder: 'Straat 123...', rows: 4 },
  ],
  map: [
    { key: 'title', label: 'Titel', type: 'text', placeholder: 'Locatie' },
    { key: 'content', label: 'Routebeschrijving', type: 'textarea', placeholder: 'Wij zijn gelegen...', rows: 3 },
  ],
  process: [
    { key: 'subtitle', label: 'Label', type: 'text', placeholder: 'Hoe het werkt' },
    { key: 'title', label: 'Titel', type: 'text', placeholder: 'Het proces', required: true },
    { key: 'content', label: 'Uitleg', type: 'textarea', placeholder: 'Stap 1:...', rows: 4 },
  ],
  content: [
    { key: 'subtitle', label: 'Label', type: 'text', placeholder: 'Titel' },
    { key: 'title', label: 'Hoofdtitel', type: 'text', placeholder: 'Titel', required: true },
    { key: 'content', label: 'Inhoud', type: 'textarea', placeholder: 'Tekst...', rows: 6 },
  ],
};

// Default fields for unknown sections
const DEFAULT_FIELDS: Array<{
  key: keyof ContentSection;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'image' | 'richtext';
  placeholder?: string;
  required?: boolean;
  rows?: number;
  help?: string;
}> = [
  { key: 'subtitle', label: 'Label / Overline', type: 'text', placeholder: 'Label boven titel' },
  { key: 'title', label: 'Titel', type: 'text', placeholder: 'Hoofdtitel', required: true },
  { key: 'content', label: 'Inhoud', type: 'textarea', placeholder: 'Tekst inhoud...', rows: 4 },
  { key: 'content2', label: 'Extra inhoud', type: 'textarea', placeholder: 'Extra tekst...', rows: 4 },
  { key: 'imageUrl', label: 'Afbeelding', type: 'image', placeholder: '/images/afbeelding.jpg' },
  { key: 'buttonText', label: 'Button tekst', type: 'text', placeholder: 'Klik hier' },
  { key: 'buttonUrl', label: 'Button link', type: 'url', placeholder: '/pagina' },
];

// Field component
function FormField({
  field,
  value,
  onChange,
}: {
  field: typeof DEFAULT_FIELDS[0];
  value: string | boolean | null | undefined;
  onChange: (value: string) => void;
}) {
  const [imageError, setImageError] = useState(false);

  switch (field.type) {
    case 'text':
    case 'url':
      return (
        <div className="relative">
          {field.type === 'url' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
          )}
          <input
            type={field.type === 'url' ? 'text' : 'text'}
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={`
              w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl
              focus:ring-2 focus:ring-[var(--rb-primary)] focus:border-transparent focus:bg-white
              transition-all duration-200 text-slate-800 placeholder:text-slate-400
              ${field.type === 'url' ? 'pl-11' : ''}
            `}
          />
        </div>
      );

    case 'textarea':
      return (
        <textarea
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={field.rows || 4}
          className="
            w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl
            focus:ring-2 focus:ring-[var(--rb-primary)] focus:border-transparent focus:bg-white
            transition-all duration-200 text-slate-800 resize-none
            placeholder:text-slate-400
          "
        />
      );

    case 'image':
      return (
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={(value as string) || ''}
              onChange={(e) => {
                onChange(e.target.value);
                setImageError(false);
              }}
              placeholder={field.placeholder || '/images/afbeelding.jpg'}
              className="
                w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl
                focus:ring-2 focus:ring-[var(--rb-primary)] focus:border-transparent focus:bg-white
                transition-all duration-200 text-slate-800 placeholder:text-slate-400
              "
            />
          </div>
          {(value as string) && !imageError ? (
            <div className="relative h-40 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <Image
                src={value as string}
                alt="Preview"
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (value as string) && imageError ? (
            <div className="h-40 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
              <div className="text-center text-red-500">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">Afbeelding niet gevonden</span>
              </div>
            </div>
          ) : null}
          <p className="text-xs text-slate-500">
            Voer een URL in of gebruik een pad zoals /images/afbeelding.jpg
          </p>
        </div>
      );

    default:
      return null;
  }
}

export default function SectionEditor({
  section,
  page,
  locale,
  onSave,
  onDelete,
  onClose,
  saving,
}: SectionEditorProps) {
  const [formData, setFormData] = useState<Partial<ContentSection>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content');

  // Get section info
  const sectionInfo = section ? (SECTION_INFO[section.section] || { 
    name: section.section, 
    icon: '📦',
    description: 'Bewerk deze sectie'
  }) : null;

  // Get fields for this section
  const fields = section ? (SECTION_FIELDS[section.section] || DEFAULT_FIELDS) : [];

  // Initialize form data when section changes
  useEffect(() => {
    if (section) {
      setFormData({
        title: section.title || '',
        subtitle: section.subtitle || '',
        content: section.content || '',
        content2: section.content2 || '',
        imageUrl: section.imageUrl || '',
        buttonText: section.buttonText || '',
        buttonUrl: section.buttonUrl || '',
        published: section.published,
      });
      setHasChanges(false);
      setActiveTab('content');
    }
  }, [section]);

  const handleChange = useCallback((key: keyof ContentSection, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
    setHasChanges(false);
  };

  const handleTogglePublished = async () => {
    const newPublished = !formData.published;
    setFormData(prev => ({ ...prev, published: newPublished }));
    setHasChanges(true);
    // Auto-save on toggle
    await onSave({ ...formData, published: newPublished });
    setHasChanges(false);
  };

  // Empty state when no section selected
  if (!section) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-slate-50">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-3xl shadow-sm flex items-center justify-center">
            <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">Geen sectie geselecteerd</h3>
          <p className="text-slate-500 max-w-xs mx-auto">
            Klik op een sectie in de preview om deze te bewerken
          </p>
        </div>
      </div>
    );
  }

  const isNew = section.id === -1;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-slate-200">
        {/* Section Header */}
        <div className="p-5 bg-gradient-to-r from-[var(--rb-primary)] to-[var(--rb-primary-dark)]">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{sectionInfo?.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{sectionInfo?.name}</h2>
                    {isNew && (
                      <span className="px-2 py-0.5 bg-amber-400 text-amber-900 text-[10px] font-bold rounded-full">
                        NIEUW
                      </span>
                    )}
                  </div>
                  <p className="text-white/70 text-xs">{sectionInfo?.description}</p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all lg:hidden"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('content')}
            className={`
              flex-1 px-4 py-3 text-sm font-medium transition-all flex items-center justify-center gap-2
              ${activeTab === 'content'
                ? 'text-[var(--rb-primary)] border-b-2 border-[var(--rb-primary)] bg-[var(--rb-primary)]/5'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }
            `}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Content
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`
              flex-1 px-4 py-3 text-sm font-medium transition-all flex items-center justify-center gap-2
              ${activeTab === 'settings'
                ? 'text-[var(--rb-primary)] border-b-2 border-[var(--rb-primary)] bg-[var(--rb-primary)]/5'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }
            `}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Instellingen
          </button>
        </div>
      </div>

      {/* Content */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
        {activeTab === 'content' ? (
          <div className="p-5 space-y-5">
            {fields.map((field) => (
              <div key={field.key} className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <FormField
                  field={field}
                  value={formData[field.key] as string | boolean | null | undefined}
                  onChange={(value) => handleChange(field.key, value)}
                />
                {field.help && (
                  <p className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {field.help}
                  </p>
                )}
              </div>
            ))}

            {fields.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-500">Geen velden beschikbaar voor deze sectie</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Published Toggle */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-semibold text-slate-800 block">Publiceren</span>
                  <span className="text-xs text-slate-500">
                    {formData.published ? 'Zichtbaar op de website' : 'Niet zichtbaar'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleTogglePublished}
                  className={`
                    relative w-14 h-8 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--rb-primary)] focus:ring-offset-2
                    ${formData.published ? 'bg-emerald-500' : 'bg-slate-300'}
                  `}
                >
                  <span
                    className={`
                      absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform flex items-center justify-center
                      ${formData.published ? 'translate-x-6' : 'translate-x-0'}
                    `}
                  >
                    {formData.published ? (
                      <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </span>
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Draft secties zijn alleen zichtbaar in de admin, niet op de live website.
              </p>
            </div>

            {/* Section Info */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-sm font-semibold text-slate-800 block mb-2">Sectie informatie</span>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">ID:</span>
                  <span className="text-slate-700 font-mono">{section.section}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pagina:</span>
                  <span className="text-slate-700">{page}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Taal:</span>
                  <span className="text-slate-700 uppercase">{locale}</span>
                </div>
              </div>
            </div>

            {/* Delete Section */}
            {!isNew && onDelete && (
              <div className="pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => onDelete(section.id)}
                  className="w-full py-3 px-4 text-red-600 hover:bg-red-50 rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Sectie verwijderen
                </button>
              </div>
            )}
          </div>
        )}
      </form>

      {/* Footer Actions */}
      <div className="flex-shrink-0 p-5 border-t border-slate-200 bg-slate-50">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving || (!hasChanges && !isNew)}
          className={`
            w-full py-3.5 px-6 rounded-xl font-semibold transition-all duration-200
            flex items-center justify-center gap-2
            ${hasChanges || isNew
              ? 'bg-gradient-to-r from-[var(--rb-primary)] to-[var(--rb-primary-dark)] text-white shadow-lg hover:shadow-xl'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }
          `}
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Opslaan...
            </>
          ) : hasChanges || isNew ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Wijzigingen opslaan
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Opgeslagen
            </>
          )}
        </button>
      </div>
    </div>
  );
}
