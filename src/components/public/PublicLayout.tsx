'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ReactNode, useState, useEffect } from 'react';
import { I18nProvider, LanguageSwitcher, useI18n } from '@/i18n/client';
import ScrollToTop from './ScrollToTop';
import Footer, { type FooterData } from './Footer';

interface PublicLayoutProps {
  children: ReactNode;
  footerData?: FooterData | null;
}

// Utility bar - Cleveland Clinic / Mayo Clinic style
function UtilityBar() {
  return (
    <div className="bg-[var(--rb-dark)] text-white py-2 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-6">
            <a href="tel:+32498686842" className="flex items-center gap-2 hover:text-[var(--rb-accent)] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              +32 498 68 68 42
            </a>
            <a href="mailto:info@revabrain.be" className="flex items-center gap-2 hover:text-[var(--rb-accent)] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              info@revabrain.be
            </a>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-white/70 hidden md:inline">Ma-Vr: 8:00 - 18:00</span>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
}

function PublicHeader() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Homepage has transparent header initially
  const isHomepage = pathname === '/';
  const showDarkMode = isHomepage && !isScrolled && !mobileMenuOpen;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`
        fixed left-0 right-0 z-50
        transition-all duration-500
        ${isScrolled ? 'top-0' : 'top-[40px]'}
        ${showDarkMode
          ? 'bg-transparent'
          : 'bg-white shadow-md'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/images/logo.png"
                alt="RevaBrain logo"
                width={48}
                height={48}
                priority
                className="rounded-xl transition-transform duration-300 group-hover:scale-110"
              />
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-xl bg-[var(--rb-accent)] opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-30" />
            </div>
            <div className="hidden sm:block">
              <span className={`font-bold text-xl transition-colors duration-300 ${showDarkMode ? 'text-white' : 'text-[var(--rb-dark)]'}`}>
                Reva
              </span>
              <span className="font-bold text-xl text-[var(--rb-primary)]">Brain</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {[
              { href: '/', label: t('nav.home') },
              { href: '/team', label: t('nav.team') },
              { href: '/verwijzers', label: 'Voor verwijzers' },
              { href: '/treatments', label: t('nav.treatments') },
              { href: '/disciplines', label: 'Disciplines' },
              { href: '/costs', label: t('nav.costs') },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-4 py-2 rounded-full font-medium transition-all duration-300
                  ${showDarkMode
                    ? 'text-white/90 hover:text-white hover:bg-white/10'
                    : 'text-gray-700 hover:text-[var(--rb-primary)] hover:bg-[var(--rb-light)]'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}

            {/* CTA Button */}
            <Link
              href="/contact"
              className={`
                ml-4 px-6 py-2.5 rounded-full font-semibold transition-all duration-300
                ${showDarkMode
                  ? 'bg-white text-[var(--rb-dark)] hover:bg-[var(--rb-accent)] hover:shadow-lg hover:shadow-[var(--rb-accent)]/30'
                  : 'bg-[var(--rb-primary)] text-white hover:bg-[var(--rb-primary-dark)] hover:shadow-lg hover:shadow-[var(--rb-primary)]/30'
                }
              `}
            >
              {t('nav.contact')}
            </Link>

          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`
              lg:hidden relative z-10 w-12 h-12 rounded-xl flex items-center justify-center
              transition-all duration-300
              ${mobileMenuOpen ? 'bg-[var(--rb-light)]' : showDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}
            `}
            aria-label="Menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`w-full h-0.5 rounded-full transition-all duration-300 origin-left ${
                  mobileMenuOpen
                    ? 'rotate-45 translate-x-px bg-[var(--rb-primary)]'
                    : showDarkMode ? 'bg-white' : 'bg-gray-800'
                }`}
              />
              <span
                className={`w-full h-0.5 rounded-full transition-all duration-300 ${
                  mobileMenuOpen
                    ? 'opacity-0 translate-x-4'
                    : showDarkMode ? 'bg-white' : 'bg-gray-800'
                }`}
              />
              <span
                className={`w-full h-0.5 rounded-full transition-all duration-300 origin-left ${
                  mobileMenuOpen
                    ? '-rotate-45 translate-x-px bg-[var(--rb-primary)]'
                    : showDarkMode ? 'bg-white' : 'bg-gray-800'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          lg:hidden fixed inset-x-0 top-20 bottom-0
          transition-all duration-500
          ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
        `}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-[var(--rb-dark)]/50 backdrop-blur-sm transition-opacity duration-500 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`
            relative mx-4 mt-4 p-6 glass rounded-3xl
            transition-all duration-500
            ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}
          `}
        >
          <nav className="flex flex-col gap-2">
            {[
              { href: '/', label: t('nav.home') },
              { href: '/team', label: t('nav.team') },
              { href: '/verwijzers', label: 'Voor verwijzers' },
              { href: '/treatments', label: t('nav.treatments') },
              { href: '/disciplines', label: 'Disciplines' },
              { href: '/costs', label: t('nav.costs') },
            ].map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-gray-800 py-4 px-4 rounded-xl hover:bg-[var(--rb-light)] hover:text-[var(--rb-primary)] transition-all duration-200"
                style={{
                  transitionDelay: mobileMenuOpen ? `${i * 50}ms` : '0ms',
                }}
              >
                {link.label}
              </Link>
            ))}

            {/* CTA Button */}
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 text-center py-4 bg-[var(--rb-primary)] text-white rounded-2xl font-semibold hover:bg-[var(--rb-primary-dark)] transition-all duration-200"
            >
              {t('nav.contact')}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

// PublicFooter is now a separate component in Footer.tsx

function PublicLayoutContent({ children, footerData }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <UtilityBar />
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <Footer data={footerData} />
      <ScrollToTop />
    </div>
  );
}

export default function PublicLayout({ children, footerData }: PublicLayoutProps) {
  return (
    <I18nProvider>
      <PublicLayoutContent footerData={footerData}>{children}</PublicLayoutContent>
    </I18nProvider>
  );
}
