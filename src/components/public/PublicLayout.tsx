'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ReactNode, useState } from 'react';
import { I18nProvider, LanguageSwitcher, useI18n } from '@/i18n/client';

interface PublicLayoutProps {
  children: ReactNode;
}

function PublicHeader() {
  const { t } = useI18n();
  const [treatmentsOpen, setTreatmentsOpen] = useState(false);

  return (
    <header className="bg-[#FCE4EC] border-b border-pink-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="RevaBrain" width={180} height={45} priority />
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
              {t('nav.home')}
            </Link>
            <Link href="/team" className="text-gray-700 hover:text-gray-900 font-medium">
              {t('nav.team')}
            </Link>
            <div className="relative">
              <button
                onClick={() => setTreatmentsOpen(!treatmentsOpen)}
                className="text-gray-700 hover:text-gray-900 font-medium flex items-center gap-1"
              >
                {t('nav.treatments')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {treatmentsOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-md shadow-lg py-2 min-w-[200px] z-50">
                  <Link
                    href="/treatments"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setTreatmentsOpen(false)}
                  >
                    Overzicht
                  </Link>
                  <Link
                    href="/treatments/neurologopedie"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setTreatmentsOpen(false)}
                  >
                    Neurologopedie
                  </Link>
                  <Link
                    href="/treatments/prelogopedie"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setTreatmentsOpen(false)}
                  >
                    Prelogopedie
                  </Link>
                </div>
              )}
            </div>
            <Link href="/costs" className="text-gray-700 hover:text-gray-900 font-medium">
              {t('nav.costs')}
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900 font-medium">
              {t('nav.contact')}
            </Link>
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}

function PublicFooter() {
  const { t } = useI18n();

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-300 mb-2">
          +32 498 68 68 42 &bull; info@revabrain.be
        </p>
        <p className="text-gray-400">
          &copy; {new Date().getFullYear()} RevaBrain. {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
}

function PublicLayoutContent({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <I18nProvider>
      <PublicLayoutContent>{children}</PublicLayoutContent>
    </I18nProvider>
  );
}
