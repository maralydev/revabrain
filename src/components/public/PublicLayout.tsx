'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ReactNode, useState, useEffect } from 'react';
import { I18nProvider, LanguageSwitcher, useI18n } from '@/i18n/client';
import ScrollToTop from './ScrollToTop';

interface PublicLayoutProps {
  children: ReactNode;
}

function PublicHeader() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [treatmentsOpen, setTreatmentsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Homepage has transparent header initially
  const isHomepage = pathname === '/';
  const showTransparent = isHomepage && !isScrolled && !mobileMenuOpen;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.treatments-dropdown')) {
        setTreatmentsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Text colors based on background
  const textColor = showTransparent ? 'text-white' : 'text-gray-800';
  const hoverColor = showTransparent ? 'hover:text-white/80' : 'hover:text-[var(--rb-primary)]';
  const underlineColor = showTransparent ? 'bg-white' : 'bg-[var(--rb-primary)]';

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${showTransparent
          ? 'bg-transparent'
          : 'bg-white shadow-sm'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="RevaBrain logo"
              width={50}
              height={50}
              priority
              className="rounded"
            />
            <span className={`font-bold text-xl hidden sm:block ${showTransparent ? 'text-white' : 'text-[var(--rb-primary)]'}`}>
              RevaBrain
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className={`${textColor} ${hoverColor} font-medium transition-colors relative group py-2`}
            >
              {t('nav.home')}
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${underlineColor} transition-all duration-300 group-hover:w-full`} />
            </Link>

            <Link
              href="/team"
              className={`${textColor} ${hoverColor} font-medium transition-colors relative group py-2`}
            >
              {t('nav.team')}
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${underlineColor} transition-all duration-300 group-hover:w-full`} />
            </Link>

            {/* Treatments Dropdown */}
            <div className="relative treatments-dropdown">
              <button
                onClick={() => setTreatmentsOpen(!treatmentsOpen)}
                className={`${textColor} ${hoverColor} font-medium flex items-center gap-1 transition-colors relative group py-2`}
              >
                {t('nav.treatments')}
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${treatmentsOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${underlineColor} transition-all duration-300 group-hover:w-full`} />
              </button>

              <div
                className={`
                  absolute top-full left-0 mt-2
                  bg-white rounded-lg shadow-lg py-2 min-w-[200px]
                  transition-all duration-200 origin-top
                  ${treatmentsOpen
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-95 pointer-events-none'
                  }
                `}
              >
                <Link
                  href="/treatments"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[var(--rb-primary)] transition-colors"
                  onClick={() => setTreatmentsOpen(false)}
                >
                  Overzicht
                </Link>
                <Link
                  href="/treatments/neurologopedie"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[var(--rb-primary)] transition-colors"
                  onClick={() => setTreatmentsOpen(false)}
                >
                  Neurologopedie
                </Link>
                <Link
                  href="/treatments/prelogopedie"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[var(--rb-primary)] transition-colors"
                  onClick={() => setTreatmentsOpen(false)}
                >
                  Prelogopedie
                </Link>
              </div>
            </div>

            <Link
              href="/costs"
              className={`${textColor} ${hoverColor} font-medium transition-colors relative group py-2`}
            >
              {t('nav.costs')}
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${underlineColor} transition-all duration-300 group-hover:w-full`} />
            </Link>

            <Link
              href="/contact"
              className={`
                px-6 py-2.5 rounded-full font-medium transition-all
                ${showTransparent
                  ? 'bg-white text-[var(--rb-primary)] hover:bg-white/90'
                  : 'bg-[var(--rb-primary)] text-white hover:bg-[var(--rb-primary-dark)]'
                }
              `}
            >
              {t('nav.contact')}
            </Link>

            <LanguageSwitcher />
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden relative z-10 w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            aria-label="Menu"
          >
            <span
              className={`w-6 h-0.5 transition-all duration-300 ${
                mobileMenuOpen
                  ? 'rotate-45 translate-y-2 bg-gray-800'
                  : showTransparent ? 'bg-white' : 'bg-gray-800'
              }`}
            />
            <span
              className={`w-6 h-0.5 transition-all duration-300 ${
                mobileMenuOpen
                  ? 'opacity-0'
                  : showTransparent ? 'bg-white' : 'bg-gray-800'
              }`}
            />
            <span
              className={`w-6 h-0.5 transition-all duration-300 ${
                mobileMenuOpen
                  ? '-rotate-45 -translate-y-2 bg-gray-800'
                  : showTransparent ? 'bg-white' : 'bg-gray-800'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          lg:hidden fixed inset-x-0 top-20 bottom-0 bg-white
          transition-all duration-300
          ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
      >
        <nav className="flex flex-col p-6 gap-1">
          <Link
            href="/"
            className="text-lg font-medium text-gray-800 py-4 border-b border-gray-100"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('nav.home')}
          </Link>
          <Link
            href="/team"
            className="text-lg font-medium text-gray-800 py-4 border-b border-gray-100"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('nav.team')}
          </Link>

          <div className="border-b border-gray-100">
            <button
              onClick={() => setTreatmentsOpen(!treatmentsOpen)}
              className="text-lg font-medium text-gray-800 py-4 w-full flex items-center justify-between"
            >
              {t('nav.treatments')}
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${treatmentsOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${treatmentsOpen ? 'max-h-40 pb-2' : 'max-h-0'}`}>
              <Link
                href="/treatments"
                className="block pl-4 py-2 text-gray-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Overzicht
              </Link>
              <Link
                href="/treatments/neurologopedie"
                className="block pl-4 py-2 text-gray-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Neurologopedie
              </Link>
              <Link
                href="/treatments/prelogopedie"
                className="block pl-4 py-2 text-gray-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Prelogopedie
              </Link>
            </div>
          </div>

          <Link
            href="/costs"
            className="text-lg font-medium text-gray-800 py-4 border-b border-gray-100"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('nav.costs')}
          </Link>

          <Link
            href="/contact"
            className="mt-6 text-center py-3 bg-[var(--rb-primary)] text-white rounded-full font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('nav.contact')}
          </Link>

          <div className="mt-4 flex justify-center">
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </header>
  );
}

function PublicFooter() {
  const { t } = useI18n();

  return (
    <footer className="bg-[var(--rb-dark)] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/logo.png"
                alt="RevaBrain logo"
                width={45}
                height={45}
                className="rounded"
              />
              <span className="font-bold text-xl text-white">RevaBrain</span>
            </div>
            <p className="text-gray-400 text-sm">
              Neurologische revalidatiepraktijk
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-300 text-sm mb-1">+32 498 68 68 42</p>
            <p className="text-gray-300 text-sm">info@revabrain.be</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Links</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/team" className="text-gray-300 text-sm hover:text-white transition-colors">
                {t('nav.team')}
              </Link>
              <Link href="/treatments" className="text-gray-300 text-sm hover:text-white transition-colors">
                {t('nav.treatments')}
              </Link>
              <Link href="/contact" className="text-gray-300 text-sm hover:text-white transition-colors">
                {t('nav.contact')}
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} RevaBrain. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}

function PublicLayoutContent({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
      <ScrollToTop />
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
