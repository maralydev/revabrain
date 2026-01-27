'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/i18n/client';

export interface FooterData {
  // Contact Info
  telefoon: string;
  email: string;
  adresStraat: string;
  adresNummer: string;
  adresPostcode: string;
  adresGemeente: string;
  // CMS Content
  tagline?: string | null;
  copyrightText?: string | null;
  // Custom links (from CMS)
  customLinks?: Array<{ label: string; url: string }>;
  behandelingLinks?: Array<{ label: string; url: string }>;
}

interface FooterProps {
  data?: FooterData | null;
}

// Default values
const DEFAULT_DATA: FooterData = {
  telefoon: '+32 498 68 68 42',
  email: 'info@revabrain.be',
  adresStraat: 'Voorbeeldstraat',
  adresNummer: '1',
  adresPostcode: '1480',
  adresGemeente: 'Tubize',
  tagline: 'Multidisciplinaire groepspraktijk voor neurologische revalidatie.',
};

export default function Footer({ data }: FooterProps) {
  const { t } = useI18n();

  // Merge with defaults
  const footerData = {
    ...DEFAULT_DATA,
    ...data,
  };

  return (
    <footer className="bg-[var(--gray-50)] border-t border-gray-200">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <Image
                src="/images/logo.png"
                alt="RevaBrain logo"
                width={48}
                height={48}
                className="rounded-xl transition-transform duration-300 group-hover:scale-105"
              />
              <div>
                <span className="font-bold text-xl text-[var(--rb-dark)]">Reva</span>
                <span className="font-bold text-xl text-[var(--rb-primary)]">Brain</span>
              </div>
            </Link>
            <p className="text-gray-600 leading-relaxed">
              {footerData.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-6 text-lg">Navigatie</h4>
            <nav className="flex flex-col gap-3">
              {[
                { href: '/team', label: t('nav.team') },
                { href: '/verwijzers', label: 'Voor verwijzers' },
                { href: '/treatments', label: t('nav.treatments') },
                { href: '/disciplines', label: 'Disciplines' },
                { href: '/costs', label: t('nav.costs') },
                { href: '/contact', label: t('nav.contact') },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-600 hover:text-[var(--rb-primary)] transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
              {/* Custom links from CMS */}
              {footerData.customLinks?.map((link, index) => (
                <Link
                  key={`custom-${index}`}
                  href={link.url}
                  className="text-gray-600 hover:text-[var(--rb-primary)] transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Treatments */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-6 text-lg">Behandelingen</h4>
            <nav className="flex flex-col gap-3">
              {footerData.behandelingLinks && footerData.behandelingLinks.length > 0 ? (
                // Use CMS behandeling links if available
                footerData.behandelingLinks.map((link, index) => (
                  <Link
                    key={`behandeling-${index}`}
                    href={link.url}
                    className="text-gray-600 hover:text-[var(--rb-primary)] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))
              ) : (
                // Default behandeling links
                <>
                  <Link
                    href="/treatments/neurologopedie"
                    className="text-gray-600 hover:text-[var(--rb-primary)] transition-colors duration-200"
                  >
                    Neurologopedie
                  </Link>
                  <Link
                    href="/treatments/prelogopedie"
                    className="text-gray-600 hover:text-[var(--rb-primary)] transition-colors duration-200"
                  >
                    Prelogopedie
                  </Link>
                  <Link
                    href="/treatments"
                    className="text-gray-600 hover:text-[var(--rb-primary)] transition-colors duration-200"
                  >
                    Alle behandelingen
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-6 text-lg">Contact</h4>
            <div className="space-y-4">
              <a
                href={`tel:${footerData.telefoon.replace(/\s/g, '')}`}
                className="flex items-center gap-3 text-gray-600 hover:text-[var(--rb-primary)] transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--rb-light)] flex items-center justify-center text-[var(--rb-primary)]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span>{footerData.telefoon}</span>
              </a>
              <a
                href={`mailto:${footerData.email}`}
                className="flex items-center gap-3 text-gray-600 hover:text-[var(--rb-primary)] transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--rb-light)] flex items-center justify-center text-[var(--rb-primary)]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span>{footerData.email}</span>
              </a>
              <div className="flex items-start gap-3 text-gray-600">
                <div className="w-10 h-10 rounded-lg bg-[var(--rb-light)] flex items-center justify-center text-[var(--rb-primary)] flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p>{footerData.adresStraat} {footerData.adresNummer}</p>
                  <p>{footerData.adresPostcode} {footerData.adresGemeente}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[var(--rb-dark)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              {footerData.copyrightText || `© ${new Date().getFullYear()} RevaBrain. ${t('footer.rights')}`}
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-gray-400 text-sm hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
