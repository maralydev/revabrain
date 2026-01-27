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

interface LivePreviewProps {
  page: string;
  sections: ContentSection[];
  selectedSection: string | null;
  onSelectSection: (section: string) => void;
  scale?: number;
}

// Mini versions of each section component for preview
function HeroPreview({ section, isSelected, onClick }: { section: ContentSection; isSelected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer transition-all duration-300 group
        ${isSelected ? 'ring-4 ring-[var(--rb-primary)] ring-offset-2' : 'hover:ring-2 hover:ring-[var(--rb-primary)]/50'}
      `}
    >
      {/* Edit indicator */}
      <div className={`
        absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full text-xs font-medium
        transition-all duration-200
        ${isSelected
          ? 'bg-[var(--rb-primary)] text-white'
          : 'bg-black/50 text-white opacity-0 group-hover:opacity-100'
        }
      `}>
        {isSelected ? '✏️ Bewerken' : 'Klik om te bewerken'}
      </div>

      <div className="relative h-[300px] bg-slate-800 overflow-hidden">
        <Image
          src="/images/onze-visie.jpg"
          alt="Hero"
          fill
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />
        <div className="absolute inset-0 flex items-center p-8">
          <div className="max-w-xl">
            <h1 className="text-2xl md:text-3xl font-light text-white mb-3 leading-tight">
              {section.title || 'Herstel begint met deskundige zorg'}
            </h1>
            <p className="text-sm text-white/80 mb-4 line-clamp-2">
              {section.content || 'Welkom bij RevaBrain, een multidisciplinaire groepspraktijk...'}
            </p>
            <div className="flex gap-2">
              <span className="inline-flex px-4 py-2 bg-white text-[var(--rb-primary)] text-xs font-semibold rounded">
                {section.buttonText || 'Maak een afspraak'}
              </span>
              <span className="inline-flex px-4 py-2 border border-white text-white text-xs font-semibold rounded">
                Onze behandelingen
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-[var(--rb-primary)] py-4 px-8">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-white">10+</div>
            <div className="text-[10px] text-white/70">Jaar ervaring</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">500+</div>
            <div className="text-[10px] text-white/70">Patiënten</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">5</div>
            <div className="text-[10px] text-white/70">Specialisaties</div>
          </div>
        </div>
      </div>

      {!section.published && (
        <div className="absolute top-4 left-4 z-20 px-2 py-1 bg-amber-500 text-white text-[10px] font-bold rounded">
          DRAFT
        </div>
      )}
    </div>
  );
}

function VisionPreview({ section, isSelected, onClick }: { section: ContentSection; isSelected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer transition-all duration-300 group bg-white py-12 px-8
        ${isSelected ? 'ring-4 ring-[var(--rb-primary)] ring-offset-2' : 'hover:ring-2 hover:ring-[var(--rb-primary)]/50'}
      `}
    >
      <div className={`
        absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full text-xs font-medium
        transition-all duration-200
        ${isSelected
          ? 'bg-[var(--rb-primary)] text-white'
          : 'bg-slate-200 text-slate-600 opacity-0 group-hover:opacity-100'
        }
      `}>
        {isSelected ? '✏️ Bewerken' : 'Klik om te bewerken'}
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="relative h-[200px] rounded-2xl overflow-hidden">
          <Image
            src={section.imageUrl || '/images/onze-visie.jpg'}
            alt="Vision"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <span className="text-[10px] font-semibold text-[var(--rb-primary)] uppercase tracking-wider">
            {section.subtitle || 'Over ons'}
          </span>
          <h2 className="text-xl font-bold text-slate-800 mt-1 mb-3">
            {section.title || 'Onze Visie'}
          </h2>
          <p className="text-xs text-slate-600 line-clamp-3">
            {section.content || 'RevaBrain is een jonge praktijk in volle ontwikkeling...'}
          </p>
          {section.content2 && (
            <p className="text-xs text-slate-600 mt-2 line-clamp-2">
              {section.content2}
            </p>
          )}
        </div>
      </div>

      {!section.published && (
        <div className="absolute top-4 left-4 z-20 px-2 py-1 bg-amber-500 text-white text-[10px] font-bold rounded">
          DRAFT
        </div>
      )}
    </div>
  );
}

function DisciplinesPreview({ section, isSelected, onClick }: { section: ContentSection; isSelected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer transition-all duration-300 group bg-slate-50 py-12 px-8
        ${isSelected ? 'ring-4 ring-[var(--rb-primary)] ring-offset-2' : 'hover:ring-2 hover:ring-[var(--rb-primary)]/50'}
      `}
    >
      <div className={`
        absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full text-xs font-medium
        transition-all duration-200
        ${isSelected
          ? 'bg-[var(--rb-primary)] text-white'
          : 'bg-white text-slate-600 opacity-0 group-hover:opacity-100'
        }
      `}>
        {isSelected ? '✏️ Bewerken' : 'Klik om te bewerken'}
      </div>

      <div className="text-center mb-6">
        <span className="text-[10px] font-semibold text-[var(--rb-primary)] uppercase tracking-wider">
          {section.subtitle || 'Wat we doen'}
        </span>
        <h2 className="text-xl font-bold text-slate-800 mt-1">
          {section.title || 'Onze Behandelingen'}
        </h2>
        <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto">
          {section.content || 'Multidisciplinaire zorg voor volwassenen en kinderen'}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {['Neurologopedie', 'Prelogopedie', 'Kinesitherapie', 'Neuropsychologie'].map((d, i) => (
          <div key={i} className="bg-white p-3 rounded-xl text-center">
            <div className="w-8 h-8 mx-auto mb-2 bg-[var(--rb-primary)]/10 rounded-lg flex items-center justify-center">
              <span className="text-[var(--rb-primary)] text-sm">🧠</span>
            </div>
            <span className="text-[10px] font-medium text-slate-700">{d}</span>
          </div>
        ))}
      </div>

      {!section.published && (
        <div className="absolute top-4 left-4 z-20 px-2 py-1 bg-amber-500 text-white text-[10px] font-bold rounded">
          DRAFT
        </div>
      )}
    </div>
  );
}

function StoryPreview({ section, isSelected, onClick }: { section: ContentSection; isSelected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer transition-all duration-300 group bg-white py-12 px-8
        ${isSelected ? 'ring-4 ring-[var(--rb-primary)] ring-offset-2' : 'hover:ring-2 hover:ring-[var(--rb-primary)]/50'}
      `}
    >
      <div className={`
        absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full text-xs font-medium
        transition-all duration-200
        ${isSelected
          ? 'bg-[var(--rb-primary)] text-white'
          : 'bg-slate-200 text-slate-600 opacity-0 group-hover:opacity-100'
        }
      `}>
        {isSelected ? '✏️ Bewerken' : 'Klik om te bewerken'}
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          {section.title && (
            <span className="text-[10px] font-semibold text-[var(--rb-primary)] uppercase tracking-wider">
              {section.title}
            </span>
          )}
          <h2 className="text-xl font-bold text-slate-800 mt-1 mb-3">
            {section.subtitle || 'Ontstaan uit passie voor neurologische zorg'}
          </h2>
          <p className="text-xs text-slate-600 line-clamp-4">
            {section.content || 'Ons verhaal begint met een gedeelde passie...'}
          </p>
        </div>
        <div className="relative h-[180px] rounded-2xl overflow-hidden">
          <Image
            src={section.imageUrl || '/images/onze-visie.jpg'}
            alt="Story"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {!section.published && (
        <div className="absolute top-4 left-4 z-20 px-2 py-1 bg-amber-500 text-white text-[10px] font-bold rounded">
          DRAFT
        </div>
      )}
    </div>
  );
}

function CTAPreview({ section, isSelected, onClick }: { section: ContentSection; isSelected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer transition-all duration-300 group
        ${isSelected ? 'ring-4 ring-[var(--rb-primary)] ring-offset-2' : 'hover:ring-2 hover:ring-[var(--rb-primary)]/50'}
      `}
    >
      <div className={`
        absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full text-xs font-medium
        transition-all duration-200
        ${isSelected
          ? 'bg-white text-[var(--rb-primary)]'
          : 'bg-white/20 text-white opacity-0 group-hover:opacity-100'
        }
      `}>
        {isSelected ? '✏️ Bewerken' : 'Klik om te bewerken'}
      </div>

      <div className="bg-gradient-to-r from-[var(--rb-primary)] to-[var(--rb-primary-dark)] py-12 px-8 text-center">
        <h2 className="text-xl font-bold text-white mb-2">
          {section.title || 'Klaar om de eerste stap te zetten?'}
        </h2>
        <p className="text-xs text-white/80 mb-4 max-w-md mx-auto">
          {section.content || 'Neem contact met ons op voor een vrijblijvend gesprek.'}
        </p>
        <span className="inline-flex px-6 py-2 bg-white text-[var(--rb-primary)] text-xs font-semibold rounded">
          {section.buttonText || 'Neem contact op'}
        </span>
      </div>

      {!section.published && (
        <div className="absolute top-4 left-4 z-20 px-2 py-1 bg-amber-500 text-white text-[10px] font-bold rounded">
          DRAFT
        </div>
      )}
    </div>
  );
}

function GenericPreview({ section, isSelected, onClick }: { section: ContentSection; isSelected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer transition-all duration-300 group bg-white py-8 px-6 border-b
        ${isSelected ? 'ring-4 ring-[var(--rb-primary)] ring-offset-2' : 'hover:ring-2 hover:ring-[var(--rb-primary)]/50'}
      `}
    >
      <div className={`
        absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full text-xs font-medium
        transition-all duration-200
        ${isSelected
          ? 'bg-[var(--rb-primary)] text-white'
          : 'bg-slate-200 text-slate-600 opacity-0 group-hover:opacity-100'
        }
      `}>
        {isSelected ? '✏️ Bewerken' : 'Klik om te bewerken'}
      </div>

      <div className="flex items-center gap-3 mb-3">
        <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-mono rounded">
          {section.section}
        </span>
        {!section.published && (
          <span className="px-2 py-1 bg-amber-500 text-white text-[10px] font-bold rounded">
            DRAFT
          </span>
        )}
      </div>

      {section.subtitle && (
        <span className="text-[10px] font-semibold text-[var(--rb-primary)] uppercase tracking-wider block">
          {section.subtitle}
        </span>
      )}
      {section.title && (
        <h3 className="text-lg font-bold text-slate-800 mt-1">
          {section.title}
        </h3>
      )}
      {section.content && (
        <p className="text-xs text-slate-600 mt-2 line-clamp-2">
          {section.content}
        </p>
      )}
      {section.buttonText && (
        <span className="inline-flex mt-3 px-4 py-1.5 bg-[var(--rb-primary)] text-white text-xs font-medium rounded">
          {section.buttonText}
        </span>
      )}
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

// Define section order for each page
const PAGE_SECTION_ORDER: Record<string, string[]> = {
  home: ['hero', 'vision', 'disciplines', 'story', 'cta'],
  team: ['hero', 'intro', 'members', 'cta'],
  treatments: ['hero', 'intro', 'list', 'cta'],
  disciplines: ['hero', 'intro', 'list'],
  costs: ['hero', 'intro', 'pricing', 'insurance', 'cta'],
  contact: ['hero', 'info', 'form', 'map'],
  verwijzers: ['hero', 'intro', 'process', 'faq', 'cta'],
  privacy: ['hero', 'content'],
  footer: ['contact', 'hours', 'social', 'legal'],
};

export default function LivePreview({ page, sections, selectedSection, onSelectSection, scale = 1 }: LivePreviewProps) {
  const sectionOrder = PAGE_SECTION_ORDER[page] || [];

  // Sort sections by defined order, put unknown sections at the end
  const sortedSections = [...sections].sort((a, b) => {
    const aIndex = sectionOrder.indexOf(a.section);
    const bIndex = sectionOrder.indexOf(b.section);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  // Create placeholder sections for missing ones
  const allSections = sectionOrder.map(sectionName => {
    const existing = sections.find(s => s.section === sectionName);
    if (existing) return existing;
    return {
      id: -1,
      section: sectionName,
      title: null,
      subtitle: null,
      content: null,
      content2: null,
      imageUrl: null,
      buttonText: null,
      buttonUrl: null,
      published: false,
    } as ContentSection;
  });

  // Add any sections not in the predefined order
  const extraSections = sections.filter(s => !sectionOrder.includes(s.section));
  const displaySections = [...allSections, ...extraSections];

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-2xl"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
    >
      {/* Browser chrome */}
      <div className="bg-slate-100 px-4 py-3 flex items-center gap-3 border-b">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-white rounded-lg px-4 py-1.5 text-xs text-slate-500 flex items-center gap-2">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          revabrain.be/{page === 'home' ? '' : page}
        </div>
      </div>

      {/* Preview content */}
      <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
        {displaySections.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">Geen secties</p>
            <p className="text-sm text-slate-400 mt-1">Voeg secties toe om de preview te zien</p>
          </div>
        ) : (
          displaySections.map((section) => {
            const PreviewComponent = SECTION_PREVIEWS[section.section] || GenericPreview;
            return (
              <PreviewComponent
                key={section.id !== -1 ? section.id : `placeholder-${section.section}`}
                section={section}
                isSelected={selectedSection === section.section}
                onClick={() => onSelectSection(section.section)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
