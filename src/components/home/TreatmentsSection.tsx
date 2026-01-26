'use client';

import Link from 'next/link';
import {
  FadeIn,
  StaggerChildren,
  SectionHeading,
  GlowCard,
  LinkWithArrow,
  ArrowIcon,
} from '@/components/public/AnimatedComponents';

interface Discipline {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface TreatmentsSectionProps {
  overline: string;
  title: string;
  description: string;
  disciplines: Discipline[];
}

// Icons for disciplines
const DisciplineIcon = ({ type, className = '' }: { type: string; className?: string }) => {
  const icons: Record<string, React.ReactNode> = {
    brain: (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
    child: (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
      </svg>
    ),
    movement: (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    mind: (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
  };
  return icons[type] || icons.brain;
};

export default function TreatmentsSection({ overline, title, description, disciplines }: TreatmentsSectionProps) {
  return (
    <section className="section-padding bg-[var(--gray-50)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          overline={overline}
          title={title}
          description={description}
        />

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StaggerChildren staggerDelay={0.1} className="contents">
            {disciplines.map((disc) => (
              <Link key={disc.id} href={`/treatments/${disc.id}`}>
                <GlowCard className="premium-card h-full group cursor-pointer">
                  <div className="icon-container mb-6">
                    <DisciplineIcon type={disc.icon} className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[var(--rb-primary)] transition-colors">
                    {disc.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {disc.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[var(--rb-primary)] text-sm font-medium group-hover:gap-3 transition-all">
                    Meer info
                    <ArrowIcon className="w-4 h-4" />
                  </span>
                </GlowCard>
              </Link>
            ))}
          </StaggerChildren>
        </div>

        <FadeIn delay={0.4}>
          <div className="text-center mt-12">
            <LinkWithArrow href="/treatments">Bekijk alle behandelingen</LinkWithArrow>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
