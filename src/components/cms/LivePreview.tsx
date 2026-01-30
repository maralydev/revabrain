'use client';

import { useState } from 'react';
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

interface LivePreviewProps {
  page: string;
  sections: ContentSection[];
  selectedSection: string | null;
  onSelectSection: (section: string) => void;
  onInlineEdit?: (section: string, field: string, value: string) => void;
  deviceView?: 'desktop' | 'tablet' | 'mobile';
}

// Section display names
const SECTION_NAMES: Record<string, string> = {
  hero: 'Hero',
  vision: 'Visie',
  disciplines: 'Diensten',
  story: 'Verhaal',
  cta: 'Call-to-Action',
  intro: 'Introductie',
  members: 'Team',
  list: 'Lijst',
  pricing: 'Tarieven',
  faq: 'FAQ',
  form: 'Formulier',
  info: 'Contact Info',
  map: 'Locatie',
  process: 'Proces',
  content: 'Content',
  insurance: 'Verzekering',
  convention: 'Conventie',
  homeVisits: 'Huisbezoeken',
  homeVisitsNote: 'Huisbezoek Info',
  contact: 'Contact',
  hours: 'Openingsuren',
  social: 'Social Media',
  legal: 'Juridisch',
};

// Section type icons
const SECTION_ICONS: Record<string, string> = {
  hero: '🎯',
  vision: '👁️',
  disciplines: '⚡',
  story: '📖',
  cta: '🚀',
  intro: '📝',
  members: '👥',
  list: '📋',
  pricing: '💶',
  faq: '❓',
  form: '📧',
  info: '📍',
  map: '🗺️',
  process: '🔄',
  content: '📄',
};

// Get section display name
function getSectionName(section: string): string {
  return SECTION_NAMES[section] || section.charAt(0).toUpperCase() + section.slice(1);
}

// Get section icon
function getSectionIcon(section: string): string {
  return SECTION_ICONS[section] || '📦';
}

// Hero Section Preview
function HeroPreview({ section, isSelected, onClick }: { section: ContentSection; isSelected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer transition-all duration-200 group overflow-hidden
        ${isSelected ? 'ring-4 ring-[var(--rb-primary)] ring-offset-4' : 'hover:ring-2 hover:ring-[var(--rb-primary)]/50 hover:ring-offset-2'}
      `}
    >
      {/* Section Label */}
      <div className={`
        absolute top-4 right-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
        transition-all duration-200 shadow-lg
        ${isSelected
          ? 'bg-[var(--rb-primary)] text-white'
          : 'bg-white/90 text-slate-700 opacity-0 group-hover:opacity-100'
        }
      `}>
        <span>{getSectionIcon(section.section)}</span>
        <span>{getSectionName(section.section)}</span>
        {isSelected && <span className="ml-1">• Bewerken</span>}
      </div>

      {/* Draft Badge */}
      {!section.published && (
        <div className="absolute top-4 left-4 z-30 px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          DRAFT
        </div>
      )}

      {/* Content */}
      <div className="relative h-[320px] bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--rb-primary)]/20 to-transparent" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--rb-accent)]/10 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 flex items-center p-8 md:p-12">
          <div className="max-w-xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              {section.title || 'Herstel begint met deskundige zorg'}
            </h1>
            <p className="text-base text-white/80 mb-6 line-clamp-2">
              {section.content || 'Welkom bij RevaBrain, een multidisciplinaire groepspraktijk...'}
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex px-5 py-2.5 bg-white text-[var(--rb-primary)] text-sm font-semibold rounded-lg shadow-lg">
                {section.buttonText || 'Maak een afspraak'}
              </span>
              <span className="inline-flex px-5 py-2.5 border-2 border-white/30 text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-colors">
                Meer info
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-[var(--rb-primary)] py-4 px-8">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">10+</div>
            <div className="text-xs text-white/70">Jaar ervaring</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">500+</div>
            <div className="text-xs text-white/70">Patiënten</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">5</div>
            <div className="text-xs text-white/70">Specialisaties</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Vision Section Preview
function VisionPreview({ section, isSelected, onClick }: { section: ContentSection; isSelected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer transition-all duration-200 group bg-white py-12 px-6 md:px-12
        ${isSelected ? 'ring-4 ring-[var(--rb-primary)] ring-offset-4' : 'hover:ring-2 hover:ring-[var(--rb-primary)]/50 hover:ring-offset-2'}
      `}
    >
      {/* Section Label */}
      <div className={`
        absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
        transition-all duration-200 shadow-lg
        ${isSelected
          ? 'bg-[var(--rb-primary)] text-white'
          : 'bg-slate-100 text-slate-700 opacity-0 group-hover:opacity-100'
        }
      `}>
        <span>{getSectionIcon(section.section)}</span>
        <span>{getSectionName(section.section)}</span>
        {isSelected && <span className="ml-1">• Bewerken</span>}
      </div>

      {!section.published && (
        <div className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          DRAFT
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative h-[280px] rounded-2xl overflow-hidden shadow-xl bg-slate-100">
            {section.imageUrl ? (
              <Image
                src={section.imageUrl}
                alt="Vision"
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">Afbeelding</span>
                </div>
              </div>
            )}
          </div>
          <div>
            <span className="inline-block px-3 py-1 bg-[var(--rb-primary)]/10 text-[var(--rb-primary)] text-xs font-bold uppercase tracking-wider rounded-full mb-3">
              {section.subtitle || 'Over ons'}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
              {section.title || 'Onze Visie'}
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {section.content || 'RevaBrain is een jonge praktijk in volle ontwikkeling...'}
            </p>
            {section.content2 && (
              <p className="text-slate-600 leading-relaxed mt-4">
                {section.content2}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Disciplines Section Preview
function DisciplinesPreview({ section, isSelected, onClick }: { section: ContentSection; isSelected: boolean; onClick: () => void }) {
  const disciplines = ['Neurologopedie', 'Prelogopedie', 'Kinesitherapie', 'Neuropsychologie'];
  
  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer transition-all duration-200 group bg-slate-50 py-12 px-6 md:px-12
        ${isSelected ? 'ring-4 ring-[var(--rb-primary)] ring-offset-4' : 'hover:ring-2 hover:ring-[var(--rb-primary)]/50 hover:ring-offset-2'}
      `}
    >
      {/* Section Label */}
      <div className={`
        absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
        transition-all duration-200 shadow-lg
        ${isSelected
          ? 'bg-[var(--rb-primary)] text-white'
          : 'bg-white text-slate-700 opacity-0 group-hover:opacity-100'
        }
      `}>
        <span>{getSectionIcon(section.section)}</span>
        <span>{getSectionName(section.section)}</span>
        {isSelected && <span className="ml-1">• Bewerken</span>}
      </div>

      {!section.published && (
        <div className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          DRAFT
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 bg-[var(--rb-primary)]/10 text-[var(--rb-primary)] text-xs font-bold uppercase tracking-wider rounded-full mb-3">
            {section.subtitle || 'Wat we doen'}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
            {section.title || 'Onze Behandelingen'}
          </h2>
          <p className="text-slate-600 mt-3 max-w-xl mx-auto">
            {section.content || 'Multidisciplinaire zorg voor volwassenen en kinderen'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {disciplines.map((discipline, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
              <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-[var(--rb-primary)]/10 to-[var(--rb-accent)]/10 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🧠</span>
              </div>
              <span className="text-sm font-semibold text-slate-800">{discipline}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Story Section Preview
function StoryPreview({ section, isSelected, onClick }: { section: ContentSection; isSelected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer transition-all duration-200 group bg-white py-12 px-6 md:px-12
        ${isSelected ? 'ring-4 ring-[var(--rb-primary)] ring-offset-4' : 'hover:ring-2 hover:ring-[var(--rb-primary)]/50 hover:ring-offset-2'}
      `}
    >
      {/* Section Label */}
      <div className={`
        absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
        transition-all duration-200 shadow-lg
        ${isSelected
          ? 'bg-[var(--rb-primary)] text-white'
          : 'bg-slate-100 text-slate-700 opacity-0 group-hover:opacity-100'
        }
      `}>
        <span>{getSectionIcon(section.section)}</span>
        <span>{getSectionName(section.section)}</span>
        {isSelected && <span className="ml-1">• Bewerken</span>}
      </div>

      {!section.published && (
        <div className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          DRAFT
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            {section.title && (
              <span className="inline-block px-3 py-1 bg-[var(--rb-primary)]/10 text-[var(--rb-primary)] text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                {section.title}
              </span>
            )}
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
              {section.subtitle || 'Ontstaan uit passie voor neurologische zorg'}
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {section.content || 'Ons verhaal begint met een gedeelde passie voor het helpen van mensen...'}
            </p>
          </div>
          <div className="relative h-[280px] rounded-2xl overflow-hidden shadow-xl bg-slate-100 order-1 md:order-2">
            {section.imageUrl ? (
              <Image
                src={section.imageUrl}
                alt="Story"
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">Afbeelding</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// CTA Section Preview
function CTAPreview({ section, isSelected, onClick }: { section: ContentSection; isSelected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer transition-all duration-200 group overflow-hidden
        ${isSelected ? 'ring-4 ring-[var(--rb-primary)] ring-offset-4' : 'hover:ring-2 hover:ring-[var(--rb-primary)]/50 hover:ring-offset-2'}
      `}
    >
      {/* Section Label */}
      <div className={`
        absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
        transition-all duration-200 shadow-lg
        ${isSelected
          ? 'bg-white text-[var(--rb-primary)]'
          : 'bg-white/20 text-white opacity-0 group-hover:opacity-100'
        }
      `}>
        <span>{getSectionIcon(section.section)}</span>
        <span>{getSectionName(section.section)}</span>
        {isSelected && <span className="ml-1">• Bewerken</span>}
      </div>

      {!section.published && (
        <div className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          DRAFT
        </div>
      )}

      <div className="relative bg-gradient-to-r from-[var(--rb-primary)] to-[var(--rb-primary-dark)] py-16 px-6 md:px-12 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {section.title || 'Klaar om de eerste stap te zetten?'}
          </h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            {section.content || 'Neem contact met ons op voor een vrijblijvend gesprek.'}
          </p>
          <span className="inline-flex px-8 py-3 bg-white text-[var(--rb-primary)] font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            {section.buttonText || 'Neem contact op'}
          </span>
        </div>
      </div>
    </div>
  );
}

// Generic Section Preview
function GenericPreview({ section, isSelected, onClick }: { section: ContentSection; isSelected: boolean; onClick: () => void }) {
  const hasContent = section.title || section.content;
  
  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer transition-all duration-200 group bg-white py-10 px-6 md:px-12
        ${isSelected ? 'ring-4 ring-[var(--rb-primary)] ring-offset-4' : 'hover:ring-2 hover:ring-[var(--rb-primary)]/50 hover:ring-offset-2'}
        ${!hasContent ? 'bg-slate-50 border-2 border-dashed border-slate-300' : ''}
      `}
    >
      {/* Section Label */}
      <div className={`
        absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
        transition-all duration-200 shadow-lg
        ${isSelected
          ? 'bg-[var(--rb-primary)] text-white'
          : 'bg-slate-100 text-slate-700 opacity-0 group-hover:opacity-100'
        }
      `}>
        <span>{getSectionIcon(section.section)}</span>
        <span>{getSectionName(section.section)}</span>
        {isSelected && <span className="ml-1">• Bewerken</span>}
      </div>

      {!section.published && (
        <div className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          DRAFT
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {section.subtitle && (
          <span className="inline-block px-3 py-1 bg-[var(--rb-primary)]/10 text-[var(--rb-primary)] text-xs font-bold uppercase tracking-wider rounded-full mb-3">
            {section.subtitle}
          </span>
        )}
        {section.title && (
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            {section.title}
          </h2>
        )}
        {section.content && (
          <div className="text-slate-600 leading-relaxed">
            {section.content}
          </div>
        )}
        {!hasContent && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-200 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">{getSectionIcon(section.section)}</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">
              {getSectionName(section.section)}
            </h3>
            <p className="text-sm text-slate-500">Klik om content toe te voegen</p>
          </div>
        )}
        {section.buttonText && (
          <div className="mt-6">
            <span className="inline-flex px-6 py-2.5 bg-[var(--rb-primary)] text-white font-medium rounded-lg">
              {section.buttonText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Empty State
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[var(--rb-primary)]/10 to-[var(--rb-accent)]/10 rounded-3xl flex items-center justify-center">
        <svg className="w-10 h-10 text-[var(--rb-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">Start met bouwen</h3>
      <p className="text-slate-500 mb-6 max-w-md mx-auto">
        Je pagina is nog leeg. Voeg je eerste sectie toe om te beginnen met het bouwen van je pagina.
      </p>
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--rb-primary)] text-white font-semibold rounded-xl hover:bg-[var(--rb-primary-dark)] transition-all shadow-lg"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Eerste sectie toevoegen
      </button>
    </div>
  );
}

// Map section types to preview components
const SECTION_PREVIEWS: Record<string, React.ComponentType<{ section: ContentSection; isSelected: boolean; onClick: () => void }>> = {
  hero: HeroPreview,
  vision: VisionPreview,
  disciplines: DisciplinesPreview,
  story: StoryPreview,
  cta: CTAPreview,
};

export default function LivePreview({ 
  page, 
  sections, 
  selectedSection, 
  onSelectSection, 
  onInlineEdit,
  deviceView = 'desktop'
}: LivePreviewProps) {
  // Filter out empty placeholder sections (id === -1 and no content)
  const realSections = sections.filter(s => s.id !== -1 || s.title || s.content);

  if (realSections.length === 0) {
    return <EmptyState onAdd={() => onSelectSection('hero')} />;
  }

  return (
    <div className="space-y-4">
      {realSections.map((section, index) => {
        const PreviewComponent = SECTION_PREVIEWS[section.section] || GenericPreview;
        const isSelected = selectedSection === section.section;
        
        return (
          <div key={section.id} className="relative">
            {/* Section Number Indicator */}
            <div className={`
              absolute -left-8 top-1/2 -translate-y-1/2 hidden xl:flex items-center justify-center
              w-6 h-6 rounded-full text-xs font-bold transition-all
              ${isSelected 
                ? 'bg-[var(--rb-primary)] text-white' 
                : 'bg-slate-200 text-slate-500'
              }
            `}>
              {index + 1}
            </div>

            {/* Section Preview */}
            <PreviewComponent
              section={section}
              isSelected={isSelected}
              onClick={() => onSelectSection(section.section)}
            />
          </div>
        );
      })}
    </div>
  );
}
