'use client';

import { useState, useEffect } from 'react';
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

// Section-specific field configurations
const SECTION_FIELDS: Record<string, {
  label: string;
  description: string;
  fields: Array<{
    key: keyof ContentSection;
    label: string;
    type: 'text' | 'textarea' | 'url' | 'image';
    placeholder?: string;
    required?: boolean;
    rows?: number;
    tip?: string;
  }>;
}> = {
  hero: {
    label: 'Hero Sectie',
    description: 'De eerste sectie die bezoekers zien - maak een sterke eerste indruk!',
    fields: [
      { key: 'title', label: 'Hoofdtitel', type: 'text', placeholder: 'Herstel begint met deskundige zorg', required: true, tip: 'Kort en krachtig - max 8 woorden' },
      { key: 'content', label: 'Ondertekst', type: 'textarea', placeholder: 'Welkom bij RevaBrain, een multidisciplinaire...', rows: 3, tip: 'Korte intro van je praktijk' },
      { key: 'buttonText', label: 'Button tekst', type: 'text', placeholder: 'Maak een afspraak' },
      { key: 'buttonUrl', label: 'Button link', type: 'url', placeholder: '/contact' },
    ],
  },
  vision: {
    label: 'Visie Sectie',
    description: 'Deel je missie en visie met bezoekers',
    fields: [
      { key: 'subtitle', label: 'Label/Overline', type: 'text', placeholder: 'Over ons', tip: 'Klein label boven de titel' },
      { key: 'title', label: 'Titel', type: 'text', placeholder: 'Onze Visie', required: true },
      { key: 'content', label: 'Eerste alinea', type: 'textarea', placeholder: 'RevaBrain is een jonge praktijk...', rows: 4 },
      { key: 'content2', label: 'Tweede alinea', type: 'textarea', placeholder: 'Wij streven ernaar...', rows: 4 },
      { key: 'imageUrl', label: 'Afbeelding', type: 'image', placeholder: '/images/onze-visie.jpg' },
    ],
  },
  disciplines: {
    label: 'Behandelingen Sectie',
    description: 'Overzicht van jullie disciplines en specialisaties',
    fields: [
      { key: 'subtitle', label: 'Label/Overline', type: 'text', placeholder: 'Wat we doen' },
      { key: 'title', label: 'Titel', type: 'text', placeholder: 'Onze Behandelingen', required: true },
      { key: 'content', label: 'Beschrijving', type: 'textarea', placeholder: 'Multidisciplinaire zorg voor...', rows: 3 },
    ],
  },
  story: {
    label: 'Verhaal Sectie',
    description: 'Vertel het verhaal achter RevaBrain',
    fields: [
      { key: 'title', label: 'Label/Overline', type: 'text', placeholder: 'Ons verhaal' },
      { key: 'subtitle', label: 'Titel', type: 'text', placeholder: 'Ontstaan uit passie voor neurologische zorg', required: true },
      { key: 'content', label: 'Tekst', type: 'textarea', placeholder: 'Ons verhaal begint met...', rows: 5 },
      { key: 'imageUrl', label: 'Afbeelding', type: 'image', placeholder: '/images/team.jpg' },
    ],
  },
  cta: {
    label: 'Call-to-Action',
    description: 'Moedig bezoekers aan om actie te ondernemen',
    fields: [
      { key: 'title', label: 'Titel', type: 'text', placeholder: 'Klaar om de eerste stap te zetten?', required: true },
      { key: 'content', label: 'Tekst', type: 'textarea', placeholder: 'Neem contact met ons op...', rows: 2 },
      { key: 'buttonText', label: 'Button tekst', type: 'text', placeholder: 'Neem contact op' },
      { key: 'buttonUrl', label: 'Button link', type: 'url', placeholder: '/contact' },
    ],
  },
  intro: {
    label: 'Introductie',
    description: 'Korte introductie bovenaan de pagina',
    fields: [
      { key: 'subtitle', label: 'Label', type: 'text', placeholder: 'Introductie' },
      { key: 'title', label: 'Titel', type: 'text', placeholder: 'Pagina titel', required: true },
      { key: 'content', label: 'Tekst', type: 'textarea', placeholder: 'Introductietekst...', rows: 4 },
    ],
  },
};

// Default configuration for unknown sections
const DEFAULT_FIELDS = {
  label: 'Sectie',
  description: 'Bewerk de content van deze sectie',
  fields: [
    { key: 'subtitle' as keyof ContentSection, label: 'Label/Overline', type: 'text' as const },
    { key: 'title' as keyof ContentSection, label: 'Titel', type: 'text' as const },
    { key: 'content' as keyof ContentSection, label: 'Inhoud', type: 'textarea' as const, rows: 4 },
    { key: 'content2' as keyof ContentSection, label: 'Extra inhoud', type: 'textarea' as const, rows: 4 },
    { key: 'imageUrl' as keyof ContentSection, label: 'Afbeelding URL', type: 'image' as const },
    { key: 'buttonText' as keyof ContentSection, label: 'Button tekst', type: 'text' as const },
    { key: 'buttonUrl' as keyof ContentSection, label: 'Button link', type: 'url' as const },
  ],
};

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
    }
  }, [section]);

  const handleChange = (key: keyof ContentSection, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
    setHasChanges(false);
  };

  if (!section) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[var(--rb-primary)]/10 to-[var(--rb-accent)]/10 rounded-3xl flex items-center justify-center">
            <svg className="w-10 h-10 text-[var(--rb-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Selecteer een sectie</h3>
          <p className="text-slate-500 max-w-xs mx-auto">
            Klik op een sectie in de preview om deze te bewerken
          </p>
        </div>
      </div>
    );
  }

  const config = SECTION_FIELDS[section.section] || DEFAULT_FIELDS;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-slate-100 bg-gradient-to-r from-[var(--rb-primary)] to-[var(--rb-primary-dark)]">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 bg-white/20 text-white/90 text-xs font-mono rounded-lg">
                {section.section}
              </span>
              {section.id === -1 && (
                <span className="px-2.5 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-lg">
                  NIEUW
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white mt-2">{config.label}</h2>
            <p className="text-white/70 text-sm mt-1">{config.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {config.fields.map((field) => (
            <div key={field.key} className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </label>

              {field.type === 'text' && (
                <input
                  type="text"
                  value={(formData[field.key] as string) || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="
                    w-full px-4 py-3 bg-slate-50 border-0 rounded-xl
                    focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white
                    transition-all duration-200 text-slate-800
                    placeholder:text-slate-400
                  "
                />
              )}

              {field.type === 'textarea' && (
                <textarea
                  value={(formData[field.key] as string) || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={field.rows || 4}
                  className="
                    w-full px-4 py-3 bg-slate-50 border-0 rounded-xl
                    focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white
                    transition-all duration-200 text-slate-800 resize-none
                    placeholder:text-slate-400
                  "
                />
              )}

              {field.type === 'url' && (
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={(formData[field.key] as string) || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="
                      w-full pl-12 pr-4 py-3 bg-slate-50 border-0 rounded-xl
                      focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white
                      transition-all duration-200 text-slate-800
                      placeholder:text-slate-400
                    "
                  />
                </div>
              )}

              {field.type === 'image' && (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={(formData[field.key] as string) || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="
                      w-full px-4 py-3 bg-slate-50 border-0 rounded-xl
                      focus:ring-2 focus:ring-[var(--rb-primary)] focus:bg-white
                      transition-all duration-200 text-slate-800
                      placeholder:text-slate-400
                    "
                  />
                  {(formData[field.key] as string) && (
                    <div className="relative h-32 rounded-xl overflow-hidden bg-slate-100">
                      <Image
                        src={formData[field.key] as string}
                        alt="Preview"
                        fill
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {field.tip && (
                <p className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {field.tip}
                </p>
              )}
            </div>
          ))}

          {/* Published toggle */}
          <div className="pt-4 border-t border-slate-100">
            <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer group hover:bg-slate-100 transition-all">
              <div>
                <span className="text-sm font-semibold text-slate-700 block">Gepubliceerd</span>
                <span className="text-xs text-slate-500">Zichtbaar op de website</span>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.published || false}
                  onChange={(e) => handleChange('published', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-8 bg-slate-200 rounded-full peer peer-checked:bg-emerald-500 transition-colors" />
                <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-sm peer-checked:translate-x-6 transition-transform flex items-center justify-center">
                  {formData.published ? (
                    <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 p-6 border-t border-slate-100 bg-slate-50/50 space-y-3">
          <button
            type="submit"
            disabled={saving || !hasChanges}
            className="
              w-full py-4 px-6
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
            ) : hasChanges ? (
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

          {section.id !== -1 && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(section.id)}
              className="
                w-full py-3 px-6
                text-red-600 font-medium rounded-xl
                hover:bg-red-50 transition-all duration-200
                flex items-center justify-center gap-2
              "
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Sectie verwijderen
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
