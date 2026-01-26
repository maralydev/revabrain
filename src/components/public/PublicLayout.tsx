'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { I18nProvider, LanguageSwitcher, useI18n } from '@/i18n/client';

interface PublicLayoutProps {
  children: ReactNode;
}

function PublicHeader() {
  const { t } = useI18n();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold" style={{ color: '#2879D8' }}>
          RevaBrain
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              {t('nav.home')}
            </Link>
            <Link href="/disciplines" className="text-gray-600 hover:text-gray-900">
              {t('nav.disciplines')}
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              {t('nav.contact')}
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              {t('nav.login')}
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
